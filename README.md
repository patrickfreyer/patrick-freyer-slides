# Patrick Freyer Slides

An automated HTML slide creation system with GitHub Actions integration for converting slides to images and PDFs.

## 📁 Directory Structure

```
├── slides/              # Put your HTML slides here (auto-converted)
│   ├── deck-1/         # Example: Organize by deck/topic
│   └── presentation-2/ # Subdirectories are fully supported
├── sample-slides/       # Example slides demonstrating different layouts
├── templates/           # Slide templates (EmptySlide.html)
├── slide-making-rules/  # Documentation and guidelines
├── export.js           # Conversion script
└── .github/workflows/  # GitHub Actions for automation
```

## 🚀 Quick Start

1. **Create a new slide**: Copy `templates/EmptySlide.html` to the `slides/` directory (or any subdirectory)
2. **Edit your slide**: Modify the HTML content within the template
3. **Commit and push**: GitHub Actions will automatically generate PNG and PDF versions
4. **Find your files**: Generated images and PDFs appear alongside your HTML files

## 🎨 Creating Slides

### Using the Template

Start with the `templates/EmptySlide.html` which includes:
- Complete BCG styling (inline CSS)
- Responsive 1600x900px dimensions
- Font Awesome icons
- Multiple theme options

### Basic Structure

```html
<div class="slide-container slide-theme-white">
    <div class="basic-background-section">
        <h1 class="normal-title">Your Slide Title</h1>
        <div class="content-box">
            <!-- Your content here -->
        </div>
    </div>
    <div class="page-number">1</div>
    <div class="footnote">Source: Your sources</div>
</div>
```

### Available Themes
- `slide-theme-white` - White background with green accents
- `slide-theme-green` - Green background with white content areas  
- `slide-theme-gray` - Gray background
- `slide-theme-dark` - Dark background

## 🤖 Automation

### GitHub Actions Workflow

The repository automatically converts HTML slides when:
- HTML files are added/modified in the `slides/` directory (including subdirectories)
- Changes are pushed to the repository
- Manually triggered via GitHub Actions

**Subdirectory Support**: You can organize slides in subdirectories like:
- `slides/product-deck/overview.html`
- `slides/quarterly-review/q1-results.html`
- `slides/training/module-1/intro.html`

### Local Development

```bash
# Install dependencies
npm install

# Convert slides manually
npm run convert

# Convert sample slides
npm run convert-sample
```

## 📋 Generated Files

For each `slide-name.html` file, the system creates:
- `slide-name.png` - High-quality PNG image (1600x900px)
- `slide-name.pdf` - PDF version optimized for printing/sharing

## 🎯 Best Practices

1. **File Naming**: Use descriptive, kebab-case names (`market-analysis-2025.html`)
2. **Directory Organization**: Group related slides in subdirectories (`slides/deck-name/`)
3. **Content Guidelines**: Follow BCG brand standards defined in the CSS
4. **Responsive Design**: Slides are optimized for 1600x900px (16:9 aspect ratio)
5. **Version Control**: HTML files are source of truth; generated files are auto-committed

## 📚 Examples

Check the `sample-slides/` directory for examples of:
- Title slides with background images
- Content slides with two-column layouts  
- Agenda slides with navigation
- Slides with icons and bullet points

## 🔧 Technical Details

- **Puppeteer**: Headless Chrome for rendering
- **PDF-lib**: PDF generation and optimization
- **GitHub Actions**: Ubuntu runner with Chrome stable
- **Node.js**: ES modules with async/await

## 🤖 AI Assistance & Agents

### Dedicated Claude Agents
This repository includes specialized Claude agents in `.claude/agents/` for slide-related tasks:

- **BCG Slide Reviewer** (`.claude/agents/bcg-slide-reviewer.md`): Comprehensive quality review against BCG professional standards
- **Custom Agents**: Create additional agents for content generation, design validation, or brand compliance

### Usage
Claude can automatically use these agents when appropriate, or you can request specific agent assistance:
- "Please review this slide with the BCG reviewer agent"
- "Use the slide reviewer to check my presentation"

### Creating Custom Agents
Add new `.md` files to `.claude/agents/` with specialized instructions for:
- Industry-specific content generation
- Design pattern validation  
- Accessibility compliance
- Brand guideline enforcement

## 📝 License

MIT License - Feel free to use and modify for your presentations.