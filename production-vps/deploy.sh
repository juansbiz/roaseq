#!/bin/bash
# =============================================================================
# Master Deploy Script — VPS k3s Production
# =============================================================================
# Usage:
#   ./deploy.sh <app> <action>
#   ./deploy.sh inboxeq apply
#   ./deploy.sh dtceq apply
#   ./deploy.sh all apply
#   ./deploy.sh inboxeq delete
#
# Prerequisites:
#   - k3s installed on VPS
#   - kubectl configured with VPS kubeconfig
#   - CF Origin certs uploaded to /etc/traefik/certs/
#   - cloudflared-prod tunnel running
#   - Secrets updated with real values (search for <PLACEHOLDER>)
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="$SCRIPT_DIR/k8s"
VPS_HOST="${VPS_HOST:-167.233.22.167}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

usage() {
    echo "Usage: $0 <app> <action>"
    echo "  app:    inboxeq | dtceq | roaseq | hificopy | navena | all"
    echo "  action: apply | delete | status | logs | restart"
    echo ""
    echo "Examples:"
    echo "  $0 inboxeq apply    # Deploy INBOXEQ to VPS"
    echo "  $0 all apply        # Deploy all apps to VPS"
    echo "  $0 inboxeq status   # Check pods status"
    echo "  $0 inboxeq delete   # Remove INBOXEQ from VPS"
    exit 1
}

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_err()  { echo -e "${RED}[ERR]${NC} $1"; }

check_prereqs() {
    log_info "Checking prerequisites..."

    if ! command -v kubectl &>/dev/null; then
        log_err "kubectl not found. Install k3s on this machine first."
        exit 1
    fi

    if ! kubectl cluster-info &>/dev/null; then
        log_err "kubectl not connected to cluster. Check KUBECONFIG."
        log_info "Set with: export KUBECONFIG=~/.kube/config-vps"
        exit 1
    fi

    local node_status=$(kubectl get nodes -o jsonpath='{.items[0].status.conditions[?(@.type=="Ready")].status}')
    if [ "$node_status" != "True" ]; then
        log_err "Kubernetes node not ready."
        kubectl get nodes
        exit 1
    fi

    log_info "kubectl connected: $(kubectl cluster-info | head -1)"
}

check_placeholders() {
    local app_dir="$1"
    local count=$(grep -r "<PLACEHOLDER\|<CURRENT_MACHINE_IP\|<CURRENT_MACHINE_PUBLIC_IP" "$K8S_DIR/$app_dir" 2>/dev/null | wc -l || true)
    if [ "$count" -gt 0 ]; then
        log_warn "$count placeholder(s) found in $app_dir — run fill-secrets.sh first!"
        log_warn "Files with placeholders:"
        grep -rl "<PLACEHOLDER\|<CURRENT_MACHINE_IP\|<CURRENT_MACHINE_PUBLIC_IP" "$K8S_DIR/$app_dir" 2>/dev/null | while read f; do
            echo "  - $f"
        done
        return 1
    fi
    return 0
}

deploy_app() {
    local app="$1"
    local app_dir="$K8S_DIR/$app"

    if [ ! -d "$app_dir" ]; then
        log_err "No k8s manifests found for app: $app"
        return 1
    fi

    log_info "=== Deploying $app to VPS ==="

    if ! check_placeholders "$app"; then
        log_warn "Skipping $app — placeholders not filled"
        return 0
    fi

    echo ""
    log_info "Applying manifests..."
    kubectl apply -f "$app_dir/" --namespace="$app"

    echo ""
    log_info "Verifying deployment..."
    sleep 3

    local pods=$(kubectl get pods -n "$app" -o jsonpath='{.items[*].metadata.name}' 2>/dev/null || echo "")
    if [ -z "$pods" ]; then
        log_err "No pods found in namespace $app — check namespace creation"
        return 1
    fi

    kubectl get pods -n "$app"
    echo ""

    log_info "Waiting for rollout..."
    kubectl rollout status deployment -n "$app" --timeout=120s || true

    local ready=$(kubectl get pods -n "$app" --field-selector=status.phase=Running --no-headers 2>/dev/null | wc -l)
    local total=$(kubectl get pods -n "$app" --no-headers 2>/dev/null | wc -l)

    if [ "$ready" -ge 1 ]; then
        log_info "$app deployed successfully! ($ready/$total pods running)"
    else
        log_err "$app deployment issue — check logs:"
        kubectl logs -n "$app" -l app="$app" --tail=20
        return 1
    fi
}

delete_app() {
    local app="$1"
    log_warn "Deleting $app from VPS..."
    kubectl delete namespace "$app" --ignore-not-found=true
    log_info "$app deleted."
}

status_app() {
    local app="$1"
    kubectl get pods,svc,ingress -n "$app" 2>/dev/null || log_err "Namespace $app not found"
}

logs_app() {
    local app="$1"
    local count="${2:-50}"
    local label=$(kubectl get deployments -n "$app" -o jsonpath='{.items[0].spec.selector.matchLabels.app}' 2>/dev/null || echo "$app")
    kubectl logs -n "$app" -l app="$label" --tail="$count" 2>/dev/null || log_err "No logs for $app"
}

restart_app() {
    local app="$1"
    local label=$(kubectl get deployments -n "$app" -o jsonpath='{.items[*].metadata.labels.app}' 2>/dev/null | tr ' ' '\n' | head -1 || echo "$app")
    log_info "Restarting $app..."
    kubectl rollout restart deployment -n "$app" -l app="$label"
    kubectl rollout status deployment -n "$app" -l app="$label" --timeout=120s
    log_info "$app restarted."
}

# ── Main ──────────────────────────────────────────────────────────────────

if [ $# -lt 2 ]; then
    usage
fi

APP="$1"
ACTION="$2"

check_prereqs

case "$ACTION" in
    apply)
        if [ "$APP" = "all" ]; then
            for a in inboxeq dtceq roaseq hificopy navena; do
                deploy_app "$a" || log_err "Failed: $a"
                echo ""
            done
        else
            deploy_app "$APP"
        fi
        ;;
    delete)
        if [ "$APP" = "all" ]; then
            log_warn "Refusing to delete ALL apps. Delete individually."
            exit 1
        fi
        delete_app "$APP"
        ;;
    status)
        if [ "$APP" = "all" ]; then
            for a in inboxeq dtceq roaseq hificopy navena; do
                echo "=== $a ==="
                status_app "$a"
                echo ""
            done
        else
            status_app "$APP"
        fi
        ;;
    logs)
        logs_app "$APP" "${3:-50}"
        ;;
    restart)
        restart_app "$APP"
        ;;
    *)
        log_err "Unknown action: $ACTION"
        usage
        ;;
esac
