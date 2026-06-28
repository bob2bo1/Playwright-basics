import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test(
  'Accessibility scan - Homepage',
  { tag: '@accessibility' },
  async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    console.log(
      `Total violations: ${accessibilityScanResults.violations.length}`
    );
    console.log(
      `Critical: ${accessibilityScanResults.violations.filter((v) => v.impact === 'critical').length}`
    );
    console.log(
      `Serious: ${accessibilityScanResults.violations.filter((v) => v.impact === 'serious').length}`
    );

    // Log violations for debugging
    accessibilityScanResults.violations.forEach((violation, index) => {
      console.log(
        `Violation ${index + 1}: ${violation.id} - ${violation.description}`
      );
      console.log(
        `Impact: ${violation.impact}, Nodes: ${violation.nodes.length}`
      );
    });

    // Set reasonable thresholds
    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical'
    );
    const seriousViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'serious'
    );

    expect(
      criticalViolations.length,
      `Found ${criticalViolations.length} critical violations`
    ).toBeLessThanOrEqual(5);
    expect(
      seriousViolations.length,
      `Found ${seriousViolations.length} serious violations`
    ).toBeLessThanOrEqual(10);
  }
);
