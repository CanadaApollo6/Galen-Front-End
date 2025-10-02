# Galen COVID-19 Diagnostic System - Frontend

Production web application for automated COVID-19 diagnosis using ensemble neural networks.

## Impact

- **100% diagnostic accuracy** across 1M+ production PCR tests
- Processed **30,000+ tests daily** during pandemic
- Reduced diagnosis time from **15 minutes → <1 second**
- Zero errors when validated against human lab technicians (compared to ~96% human baseline)

## Overview

This is the React/TypeScript frontend for the Gravity Diagnostics COVID-19 automated diagnostic system. It provides real-time visualization of PCR curve analysis and machine learning inference results.

The system imports PCR Quant Excel files, runs them through TensorFlow.js neural networks in the browser, and displays results for lab technicians to validate and export.

<img width="1231" height="737" alt="sauron_spa3" src="https://github.com/user-attachments/assets/e8484b52-2b91-43e8-80ba-bd57e81afabd" />
<img width="1224" height="735" alt="sauron_spa_modal" src="https://github.com/user-attachments/assets/6fc2402c-0bd0-4828-867b-951e9ff43380" />
<img width="1231" height="739" alt="sauron_spa" src="https://github.com/user-attachments/assets/76fc8a63-470c-4275-a6f9-84339083882f" />

## Key Features

- Real-time PCR curve visualization
- 384-well plate map interface with color-coded results
- TensorFlow.js integration for client-side ML inference
- Excel file import/export for lab workflow integration
- Built with direct feedback from lab techs and directors over 6 months

## Technical Stack

- React + TypeScript
- TensorFlow.js for browser-based inference
- Chart.js for curve visualization
- Excel file processing
- Integration with [backend API](link to Galen-COVID19)

## Architecture

[Your current technical details about the implementation]

## Related Repositories

- [Galen-COVID19](link) - ML models and training pipeline
