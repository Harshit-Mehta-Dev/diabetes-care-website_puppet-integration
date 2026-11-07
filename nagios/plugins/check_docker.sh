#!/bin/bash
# Nagios Custom Plugin: Check Docker Container Status
# Usage: ./check_docker.sh <container_name>

CONTAINER_NAME="$1"

if [ -z "$CONTAINER_NAME" ]; then
    echo "UNKNOWN - Container name parameter is required."
    exit 3
fi

STATUS=$(docker inspect --format='{{.State.Status}}' "$CONTAINER_NAME" 2>/dev/null)

if [ "$STATUS" == "running" ]; then
    echo "OK - Container '$CONTAINER_NAME' is running."
    exit 0
elif [ "$STATUS" == "restarting" ] || [ "$STATUS" == "paused" ]; then
    echo "WARNING - Container '$CONTAINER_NAME' is in status: $STATUS."
    exit 1
elif [ "$STATUS" == "exited" ] || [ "$STATUS" == "dead" ]; then
    echo "CRITICAL - Container '$CONTAINER_NAME' is stopped/exited."
    exit 2
else
    echo "CRITICAL - Container '$CONTAINER_NAME' not found or docker daemon unreachable."
    exit 2
fi
