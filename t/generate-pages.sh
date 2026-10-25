#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
for number in $(seq 1 540); do
  cp "$script_dir/question-template.html" "$script_dir/$number.html"
done

