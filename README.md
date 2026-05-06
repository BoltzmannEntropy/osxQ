<div align="center">
  <img src="assets/mlx_logo.png" alt="mlxQ Logo" width="360"/>
  <h1>mlxQ / QuantumStudio</h1>
  <p>Apple Silicon quantum simulation stack with two execution modes:<br><b>Command-line benchmark runners</b> and <b>QuantumStudio desktop UI</b>.</p>
</div>

> Website: https://boltzmannentropy.github.io/osxQuantumWEB/  
> Code repository: https://github.com/BoltzmannEntropy/osxQ

## What This Repository Contains

This repository has two complementary interfaces:

1. **CLI benchmark workflow (paper-grade runs)**
- Main launchers: `bench.sh`, `bench_with_logging.sh`
- Core benchmark engine: `src/benchmark/bench.py`
- Best for reproducible sweeps, logs, and figure regeneration

2. **QuantumStudio UI workflow (desktop app)**
- UI root: `quantumstudio/`
- App control wrapper: `quantumstudio/bin/appctl`
- Best for interactive benchmark setup, run management, and visual inspection

## Paper Alignment (QUANTICS 2026)

Camera-ready source:
- `paper/quantics-lncs-2026/mlxquantum_quantics2026_lncs.tex`

The benchmark families covered by the paper and supported here include:
- `qft`
- `qaoa`
- `qcbm`
- `hamiltonian_simulation`
- `time_evolution`
- `random_circuit`
- `variational_circuit`
- `grover`
- `ghz`
- `phase_estimation`
- `vqe`
- plus extended families in the current runner (`heisenberg*`, `tfim*`, `long_range_ising`, `ladder_heisenberg`, `steady_state`, `trotter`)

## Repository Structure

- `src/` Python package and benchmark code
- `bench.sh` direct benchmark runner
- `bench_with_logging.sh` benchmark runner with timestamped logs
- `bench/` generated run outputs (`.csv`, `.json`, `.png`, logs)
- `assets/benchmarks-frozen/` frozen benchmark artifact snapshots (release/repro source of truth)
- `datasets/qasm/local/` local OpenQASM inputs
- `benchmarks/mqtbench/` vendor benchmark corpus
- `quantumstudio/` desktop app and backend orchestration
- `paper/quantics-lncs-2026/` LNCS camera-ready source

## Prerequisites

- macOS 13.3+
- Apple Silicon (M1/M2/M3/M4)
- Python 3.10+

Setup:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install mlx numpy matplotlib textual pennylane
```

For local commands in this repo:

```bash
export PYTHONPATH=src
```

For QuantumStudio backend dependencies:

```bash
pip install -r quantumstudio/backend/requirements.txt
```

## Command-Line Benchmarks

### Fast Start

Run full suite with defaults:

```bash
./bench.sh
```

Run full suite with logging snapshot:

```bash
./bench_with_logging.sh
```

### Common CLI Recipes

Global qubit cap:

```bash
./bench.sh --max-qubits 12
```

Per-benchmark caps:

```bash
./bench.sh --cap-qft 20 --cap-vqe 12 --cap-phase_estimation 14
```

Single benchmark family:

```bash
./bench.sh --circuit qaoa --simulate-limit 20
```

Run OpenQASM suite:

```bash
./bench.sh --qasm-suite --qasm-max-qubits 18 --qasm-timeout-ms 30000
```

Paper-like qubit schedule preset:

```bash
./bench.sh --paper-2504
```

MPS backend run:

```bash
./bench.sh --backend mps --mps-dmax 128 --mps-eps 1e-10
```

Full run with logs plus MPS follow-up:

```bash
./bench_with_logging.sh --with-mps
```

### Useful Flags (CLI)

From `bench.sh`:
- `--max-qubits N`
- `--cap-<key> N`
- `--qubits CSV|A-B`
- `--all-qubits N`
- `--circuit NAME`
- `--simulate-limit N`
- `--qasm-suite`
- `--benchpress`
- `--mqtbench`
- `--backend sv|mps`
- `--mps-dmax N`, `--mps-eps X`, `--mps-bmax N`
- `--mps-stop-on-trunc`, `--mps-pair-sweeps`, `--mps-mpo-zz`, `--mps-mpo-xx`, `--mps-mpo-yy`
- `--paper-2504`
- `--save-plots`, `--no-save-plots`

From `bench_with_logging.sh`:
- `--with-mps`
- `--with-mpsd`
- `--frozen-parity-12` (SV + MPS full suite + `time_evolution` MPSD, capped to 12 qubits)
- Same key runtime controls (`--max-qubits`, `--cap-*`, `--circuit`, etc.)

### Output Locations (CLI)

- Per-run output folders: `bench/runs/run_YYYYmmdd_HHMMSS/`
- Current run pointer: `bench/current`
- Timestamped logs (inside each run folder): `BENCHMARK_RUN_*.log`
- Latest log pointer: `bench/LATEST_BENCHMARK.log`
- Generated metrics and plots: current run folder under `bench/runs/`
- Frozen latest promoted artifacts: `assets/benchmarks-frozen/latest/`
- Frozen baseline snapshot: `assets/benchmarks-frozen/baseline_2026-05-01/`

## QuantumStudio UI Workflow

QuantumStudio provides a GUI path for running and inspecting experiments.

### Start UI + Backend

```bash
cd quantumstudio
./bin/appctl up
```

Check status:

```bash
./bin/appctl status
```

Backend logs:

```bash
./bin/appctl logs backend
```

Stop services:

```bash
./bin/appctl down
```

### Build QuantumStudio Flutter App

From `quantumstudio/`:

```bash
./scripts/build_flutter_app.sh --release
```

Debug build:

```bash
./scripts/build_flutter_app.sh --debug
```

DMG packaging (if desired):

```bash
./scripts/build_dmg.sh
```

### UI Benchmark Guidance

Use UI when you need:
- Interactive benchmark selection and parameter editing
- Visual run monitoring
- Quick comparison of result artifacts before formal paper export

Use CLI when you need:
- Batch sweeps and deterministic reruns
- Full logging and automation
- Regeneration of publication figures/tables at scale

## Using Frozen Benchmarks

Benchmark artifacts for release and reproducibility live under `assets/benchmarks-frozen/`:

- `bench/runs/<run_id>/` = generated outputs from a specific run
- `assets/benchmarks-frozen/latest/` = latest promoted artifacts (auto-copied by `bench_with_logging.sh`)
- `assets/benchmarks-frozen/baseline_2026-05-01/` = preserved frozen baseline snapshot
- `assets/benchmarks-frozen/from_assets_benchmarks_2026-05-02/` = migrated legacy `assets/benchmarks` content
- `assets/benchmarks-frozen/sample-runs/` = restored legacy sample material for audit/recovery

`sample-runs/` currently includes:
- `legacy_25q_logs_2025-10/` = selected historical `BENCHMARK_RUN_*.log` files with 24/25-qubit coverage
- `legacy_dmg_stage_bench_snapshot/` = full legacy benchmark snapshot (images, CSV/JSON, logs, reports)
- `README.txt` = provenance note for copied sample assets

Artifact types you can expect in frozen folders:
- Images: `*_scaling.png`, `all_benchmarks_comparison.png`, `all_mps_bonds_comparison.png`, `*_bonds.png`
- CSV: `*_data.csv`, `*_summary.csv`, `*_bonds.csv`, distribution CSVs
- JSON: `*_mlx_quantum.json`, report JSONs
- Logs: `BENCHMARK_RUN_*.log`, `LATEST_BENCHMARK.log` (for some snapshots)

Recommended flow:
1. Run experiments via CLI or UI.
2. Validate raw outputs in `bench/runs/<run_id>/`.
3. Compare against `assets/benchmarks-frozen/baseline_2026-05-01/`.
4. Promote validated artifacts to `assets/benchmarks-frozen/latest/`.
5. Keep immutable historical references under `assets/benchmarks-frozen/sample-runs/` (do not overwrite in place).

Regenerate and promote fresh paper-grade assets:
1. Run: `./bench_with_logging.sh --frozen-parity-12` (or full benchmark mode).
2. Inspect artifacts in `bench/runs/<run_id>/`.
3. Copy selected figures/tables to paper folders only after validation.
4. Keep the full run folder as the source of truth for reproducibility.

12-qubit parity command (for baseline-shape comparison):

```bash
./bench_with_logging.sh --frozen-parity-12
```

## Validation / Test Entry Points

Core test runner:

```bash
./test.sh
```

Legacy benchmark test artifacts were archived to:
- `purge/bench_artifacts/bench_test/`
- `purge/bench_artifacts/bench_test_unit/`

## Notes

- This README describes the active Python + QuantumStudio workflow in this repository.
- Publication and camera-ready materials live under `paper/quantics-lncs-2026/`.
