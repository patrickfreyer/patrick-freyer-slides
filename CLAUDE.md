# Claude AI Instructions for Slide Creation

This file contains instructions for AI assistants (particularly Claude) when helping create HTML slides for this repository.

## Repository Overview

This is an automated slide creation system that converts HTML slides to PNG images and PDFs using GitHub Actions. The system uses BCG-style CSS with inline styling for professional presentations.

## Key Files and Structure

- **`templates/EmptySlide.html`**: Base template with complete inline CSS
- **`slides/`**: Directory for HTML slides (supports subdirectories for organization)
- **`export.js`**: Conversion script (HTML → PNG/PDF)
- **`.github/workflows/convert-slides.yml`**: GitHub Actions automation

## Slide Creation Guidelines

### 1. Always Use the Template
- Start with `templates/EmptySlide.html` 
- You can make your life easier by copying over this template and iterating on it
- Never create slides from scratch
- The template includes all necessary CSS inline (do not reference external stylesheets)
- You may add CSS styles inline as needed

### 2. File Naming Conventions
- Use kebab-case: `market-analysis-2025.html`
- Be descriptive but concise
- Avoid spaces (use hyphens instead)

### 3. Directory Organization
- Use subdirectories in `slides/` for logical grouping:
  - `slides/product-deck/`
  - `slides/quarterly-review/`
  - `slides/training/module-1/`

### 4. Slide Dimensions
- Fixed size: **1600x900px** (16:9 aspect ratio)
- Do not modify the viewport or container dimensions
- All content must fit within these bounds

## CSS Classes and Layout Options

### Container and Themes
```html
<div class="slide-container slide-theme-white">        <!-- White background -->
<div class="slide-container slide-theme-green">       <!-- Green background -->
<div class="slide-container slide-theme-gray">        <!-- Gray background -->
<div class="slide-container slide-theme-dark">        <!-- Dark background -->
```

### Layout Sections
```html
<!-- Basic full-width layout (most common) -->
<div class="basic-background-section">

<!-- Two-column with arrow shapes -->
<div class="arrow-background-section-left">
<div class="arrow-background-section-right">

<!-- Agenda/chapter layout -->
<div class="slide-container agenda-slide">
  <div class="decorative-left-section">
  <div class="main-content-section">
```

### Typography
```html
<h1 class="normal-title">Main slide title</h1>
<h2 class="section-title">Section heading</h2>
<div class="standard-text">Body text</div>
<span class="text-bold">Bold emphasis</span>
```

### Content Organization
```html
<!-- Grid layouts -->
<div class="content-grid-columns" style="--grid-columns: 2; --grid-gap: 40px;">
<div class="content-grid-rows" style="--grid-rows: 3; --grid-gap: 30px;">

<!-- Bullet points -->
<div class="bullet-point">Bullet point text</div>

<!-- Icon elements -->
<div class="icon-and-number-ball">
  <i class="fas fa-chart-line"></i>
</div>

<!-- Callout boxes -->
<div class="callout-box">Important note or insight</div>
```

## Content Creation Best Practices

### 1. Professional Content
- Use business-appropriate language
- Include data sources in footnotes
- Keep text concise and scannable
- Use bullet points for lists

### 2. Visual Hierarchy
- One main message per slide
- Use section titles to group related content
- Leverage white space effectively
- Maintain consistent spacing

### 3. BCG Brand Standards
- Use provided color scheme (CSS variables)
- Stick to approved typography classes
- Include page numbers and sources
- Professional, clean design aesthetic

### 4. Font Awesome Icons
- Use Font Awesome 6.4.0 icons (already included)
- Common business icons: `fa-chart-line`, `fa-users`, `fa-lightbulb`, `fa-target`
- Place in `icon-and-number-ball` or `icon-and-number-ball-inline` containers

## Technical Requirements

### 1. Self-Contained HTML
- All CSS must be inline (already in template)
- No external stylesheets except Font Awesome CDN
- No external images unless absolutely necessary

### 2. Required Elements
```html
<!-- Always include these elements -->
<div class="page-number">1</div>
<div class="footnote">Source: Your data sources</div>
```

### 3. Responsive Considerations
- Design for 1600x900px exactly
- Test content doesn't overflow
- Consider how text scales

## Automation Process

### 1. File Processing
When HTML files are added/modified in `slides/`:
1. GitHub Actions triggers automatically
2. Puppeteer converts HTML → PNG (1600x900px)
3. Puppeteer converts HTML → PDF (16.67×9.375 inches)
4. Generated files appear alongside HTML
5. Files are committed back to repository

### 2. Generated Files
For `slide-name.html`, creates:
- `slide-name.png` - High-quality image
- `slide-name.pdf` - Print-ready PDF

## Example Slide Types

### Title Slide
```html
<div class="slide-container slide-theme-title">
  <div class="background-overlay"></div>
  <div class="title-slide-container">
    <div class="content-overlay-box">
      <h1 class="main-title">Presentation Title</h1>
      <h2 class="subtitle">Subtitle or Description</h2>
    </div>
  </div>
  <div class="white-footer">
    <div class="date-stamp">January 2025</div>
  </div>
</div>
```

### Content Slide
```html
<div class="slide-container slide-theme-white">
  <div class="basic-background-section">
    <h1 class="normal-title">Slide Title</h1>
    <div class="content-box">
      <div class="content-grid-columns" style="--grid-columns: 2;">
        <div><!-- Left column content --></div>
        <div><!-- Right column content --></div>
      </div>
    </div>
  </div>
  <div class="page-number">2</div>
  <div class="footnote">Source: Data source</div>
</div>
```

### Agenda Slide
```html
<div class="slide-container slide-theme-white agenda-slide">
  <div class="decorative-left-section">
    <h1 class="left-section-title arrow-title">Agenda</h1>
  </div>
  <div class="main-content-section">
    <div class="agenda-items">
      <div class="agenda-item active">
        <div class="agenda-arrow">1</div>
        <span>Current Topic</span>
      </div>
      <div class="agenda-item inactive">
        <div class="agenda-arrow">2</div>
        <span>Future Topic</span>
      </div>
    </div>
  </div>
</div>
```

## Error Prevention

### Common Mistakes to Avoid
- ❌ Don't reference external CSS files
- ❌ Don't modify slide container dimensions
- ❌ Don't use absolute positioning extensively
- ❌ Don't forget page numbers and footnotes
- ❌ Don't use non-Font Awesome icons

### Validation Checklist
- ✅ Uses EmptySlide.html as base
- ✅ All CSS is inline
- ✅ Includes page number
- ✅ Includes footnote with sources
- ✅ Uses proper CSS classes
- ✅ Content fits in 1600x900 viewport
- ✅ Professional and business-appropriate

## Testing and Quality

### Local Testing
```bash
# Convert slides locally to test
npm install
npm run convert

# Check sample slides
npm run convert-sample
```

### GitHub Actions
- Push HTML files to `slides/` directory
- Check Actions tab for conversion status
- Generated PNG/PDF files appear automatically
- Review generated files for quality

## Dedicated Agents

This repository includes dedicated Claude agents in `.claude/agents/` for specialized slide-related tasks:

### BCG Slide Reviewer Agent
- **File**: `.claude/agents/bcg-slide-reviewer.md`
- **Purpose**: Comprehensive quality review of HTML slides against BCG professional standards
- **Usage**: Use when you need detailed feedback on slide design, layout, content structure, and compliance
- **Features**: Systematic checklist covering visual hierarchy, messaging, alignment, visibility, charts, and boundaries

### Creating Additional Agents
You can create custom agents for specific slide-related tasks:

```markdown
---
name: slide-content-generator
description: Generates slide content for specific business scenarios
---

[Agent instructions here...]
```

Common agent types for slide creation:
- **Content generators**: Create slide content for specific industries/topics
- **Design validators**: Check specific design patterns or layouts
- **Brand compliance**: Ensure adherence to specific company guidelines
- **Accessibility reviewers**: Verify slides meet accessibility standards

This system enables rapid creation of professional, branded slides with automatic conversion to multiple formats. Follow these guidelines to ensure consistency and quality across all presentations.