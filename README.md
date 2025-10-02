# Galen COVID-19 Diagnostic System - Frontend

React/TypeScript web application providing real-time visualization and interface for automated COVID-19 PCR analysis.

## Production Impact

- Processed **30,000+ PCR tests daily** during pandemic deployment
- Reduced diagnosis time from **15 minutes → <1 second**
- Enabled real-time monitoring across **96-well plate formats**
- Zero-latency client-side inference via TensorFlow.js

## Overview

This React application serves as the user interface for Gravity Diagnostics' automated COVID-19 diagnostic system. Lab technicians use it to import PCR data, visualize curve analysis, and review ML-generated diagnoses in real-time.

The system runs entirely in the browser - importing Excel files from PCR instruments, executing neural network inference via TensorFlow.js, and displaying results without any server-side processing.

## Screenshots

<img width="1231" height="737" alt="sauron_spa3" src="https://github.com/user-attachments/assets/e8484b52-2b91-43e8-80ba-bd57e81afabd" />
<img width="1224" height="735" alt="sauron_spa_modal" src="https://github.com/user-attachments/assets/6fc2402c-0bd0-4828-867b-951e9ff43380" />
<img width="1231" height="739" alt="sauron_spa" src="https://github.com/user-attachments/assets/76fc8a63-470c-4275-a6f9-84339083882f" />

## Key Features

**PCR Data Import & Processing**
- Direct import of QuantStudio Excel files (.xlsx format)
- Automatic parsing and normalization of 96-well plate data
- Support for multiple plate layouts and instrument configurations

**Real-Time ML Inference**
- TensorFlow.js models loaded and run client-side
- Processes all 384 samples in under 1 second
- No server dependency - works offline once loaded

**Clinical Visualization**
- Color-coded 384-well plate map showing detection status
- Individual PCR curve visualization with cycle thresholds
- Gene-specific analysis (MS2, N, S, ORF1ab, RP) per sample
- Quality control indicators via MS2 validation

**Workflow Integration**
- Export results in format compatible with lab's patient notification system
- Batch processing for high-throughput scenarios
- Built with direct feedback from lab technicians over 6-month development period

## Technical Architecture

**Frontend Stack:**
- React with TypeScript
- TensorFlow.js for browser-based ML inference
- Plotly.js for PCR curve visualization
- Custom state management for plate data

**Data Flow:**
1. User imports QuantStudio Excel file
2. Parser extracts PCR curve data for each well
3. Data normalized and formatted for ML models
4. Five gene-specific TensorFlow.js models run inference
5. Ensemble logic applies clinical decision rules
6. Results displayed with visual indicators and exportable format

**Clinical Decision Logic:**

The frontend implements the ensemble decision logic:
- MS2 control gene validates sample quality
- At least one viral gene (N, S, ORF1ab) required for positive detection
- Invalid samples flagged when MS2 absent but viral genes detected
- Mirrors standard clinical PCR diagnostic protocols

See [backend repository](https://github.com/CanadaApollo6/Galen-COVID19) for detailed ensemble architecture.

## Development Context

Built as the sole frontend developer working directly with:
- Lab technicians (primary users providing daily feedback)
- Lab directors (clinical validation requirements)
- Backend ML engineer (model integration)

The iterative development process prioritized:
- Fast, intuitive workflow for time-pressured lab environment
- Zero-tolerance error handling for medical context
- Minimal training required for lab tech adoption

## Technical Challenges Solved

**Browser-Based ML Deployment:**
- Loading and running 5 separate neural networks in-browser
- Optimizing TensorFlow.js performance for sub-second inference
- Memory management for batch processing

**Real-World Data Variability:**
- Handling inconsistent Excel export formats from instruments
- Parsing variations in plate layouts and sample annotations
- Graceful degradation when incomplete data provided

**Clinical Workflow Integration:**
- Designing UI that fits existing lab processes
- Export format matching downstream patient notification systems
- Building trust with lab techs skeptical of automated systems

## Repository Structure

```text
src/
├── ai/               # TensorFlow.js model loading and inference logic
├── components/       # React UI components
├── containers/       # Container components for application layout
├── contexts/         # React context providers for state management
├── services/         # Data processing and business logic
└── types/            # TypeScript type definitions
```

## Related Projects

- [Galen-COVID19](https://github.com/CanadaApollo6/Galen-COVID19) - ML models, training pipeline, and ensemble architecture

## Technology Decisions

**Why React + TypeScript:**
Type safety was critical for medical application - caught numerous bugs during development that could have led to misdiagnoses.

**Why Client-Side Inference:**
Lab workstations had inconsistent network connectivity. Running everything in the browser eliminated server dependencies and network latency issues during high-volume testing periods.

**Why Direct Excel Import:**
Lab techs were already exporting from QuantStudio to Excel for manual review. Supporting their existing workflow reduced training burden and adoption friction.

## License

[Your license]

## Acknowledgments

Built in partnership with Gravity Diagnostics during the COVID-19 pandemic. Special thanks to the lab technicians who provided patient feedback and helped refine the interface for real-world clinical use.
