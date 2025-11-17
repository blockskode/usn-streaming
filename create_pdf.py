#!/usr/bin/env python3
"""
Convert WORKSHOP_OVERVIEW.html to PDF
"""
from weasyprint import HTML
import os

# Change to the kafka-workshop-app directory
os.chdir('kafka-workshop-app')

# Convert HTML to PDF
print("Converting HTML to PDF...")
HTML('WORKSHOP_OVERVIEW.html').write_pdf('WORKSHOP_OVERVIEW.pdf')
print("✅ PDF created successfully: kafka-workshop-app/WORKSHOP_OVERVIEW.pdf")
