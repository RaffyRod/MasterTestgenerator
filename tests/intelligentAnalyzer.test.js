import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  generateIntelligentTestCases,
  analyzeProjectInfo,
  extractAcceptanceCriteria
} from '../src/core/analysis/intelligentAnalyzer.js'

describe('intelligentAnalyzer', () => {
  describe('extractAcceptanceCriteria', () => {
    it('should extract ACs with AC prefix', () => {
      // The function groups Gherkin lines, so we need to format it correctly
      const projectInfo = `AC1:
Given I am logged in
When I click on the button
Then I should see the page.

AC2:
Given the page is loaded
When I view it
Then I should see the content.`
      const acs = extractAcceptanceCriteria(projectInfo)
      // Should extract at least the Gherkin groups
      expect(acs.length).toBeGreaterThanOrEqual(2)
    })

    it('should extract ACs with AC: format', () => {
      const projectInfo = 'AC: Given I am logged in, When I click, Then I see the page.'
      const acs = extractAcceptanceCriteria(projectInfo)
      expect(acs.length).toBeGreaterThan(0)
    })
  })

  describe('generateIntelligentTestCases', () => {
    it('should return empty array for empty input', async () => {
      const result = await generateIntelligentTestCases('')
      expect(result).toEqual([])
    })

    it('should generate test cases for single AC', async () => {
      const projectInfo =
        'AC1: Given I am logged in, When I click the button, Then I should see the page.'
      const result = await generateIntelligentTestCases(projectInfo, 'stepByStep', null, 1, false)

      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('title')
      expect(result[0]).toHaveProperty('steps')
      expect(result[0]).toHaveProperty('expectedResult')
      expect(result[0].type).toBe('Functional')
    })

    it('should generate correct number of test cases per AC', async () => {
      const projectInfo = `AC3: Given the "Browse by province" section is expanded, When I view it, Then I should see a list of provinces.
AC4: Given I click on a province name, When the page loads, Then I should be taken to a province-level results page.`
      const testsPerAC = 2
      const result = await generateIntelligentTestCases(
        projectInfo,
        'stepByStep',
        null,
        testsPerAC,
        false
      )

      // Should generate 2 test cases per AC = 4 total
      // This test will help us identify the bug where only 3 are generated
      expect(result.length).toBe(4)

      // Group by AC
      const ac3Tests = result.filter(tc => tc.acId === 3)
      const ac4Tests = result.filter(tc => tc.acId === 4)

      expect(ac3Tests.length).toBe(2)
      expect(ac4Tests.length).toBe(2)
    })

    it('should generate test cases with different variations', async () => {
      const projectInfo =
        'AC1: Given I am logged in, When I click the button, Then I should see the page.'
      const result = await generateIntelligentTestCases(projectInfo, 'stepByStep', null, 3, false)

      expect(result.length).toBe(3)

      // Check that variations have different titles or steps
      const titles = result.map(tc => tc.title)
      const uniqueTitles = new Set(titles)
      // At least some variation in titles
      expect(uniqueTitles.size).toBeGreaterThan(1)
    })

    it('should always use Functional type by default', async () => {
      const projectInfo = 'AC1: Given I view the page, When I see it, Then I should see content.'
      const result = await generateIntelligentTestCases(projectInfo, 'stepByStep', null, 1, false)

      expect(result.length).toBeGreaterThan(0)
      result.forEach(tc => {
        expect(tc.type).toBe('Functional')
      })
    })

    it('should not generate Performance test cases for view/browse actions', async () => {
      const projectInfo = `
        AC3: Given the "Browse by province" section is expanded, When I view it, Then I should see a list of provinces.
        AC4: Given I click on a province name, When the page loads, Then I should be taken to a province-level results page.
      `
      const result = await generateIntelligentTestCases(projectInfo, 'stepByStep', null, 1, false)

      result.forEach(tc => {
        expect(tc.type).not.toBe('Performance')
        expect(tc.type).toBe('Functional')
      })
    })

    it('should generate steps that are not generic placeholders', async () => {
      const projectInfo =
        'AC1: Given I click on a province name, When the page loads, Then I should see the province details.'
      const result = await generateIntelligentTestCases(projectInfo, 'stepByStep', null, 1, false)

      expect(result.length).toBeGreaterThan(0)
      const steps = result[0].steps

      // Should not contain the most generic placeholder steps
      // Note: Some generic steps might still appear, but we should avoid the worst ones
      const hasGenericPlaceholder =
        steps.includes('Perform the required action') &&
        steps.includes('Verify the expected result') &&
        !steps.includes('province')

      // If it has generic placeholders, it should at least have some specific content too
      if (hasGenericPlaceholder) {
        expect(steps).toContain('province')
      }

      // Should contain specific steps
      expect(steps.length).toBeGreaterThan(50) // Should have some content
    })

    it('should generate expected results that are readable', async () => {
      const projectInfo =
        'AC1: Given I click on a province name, When the page loads, Then I should be taken to a province-level results page showing all branches.'
      const result = await generateIntelligentTestCases(projectInfo, 'stepByStep', null, 1, false)

      expect(result.length).toBeGreaterThan(0)
      const expectedResult = result[0].expectedResult

      // Should not be generic
      expect(expectedResult).not.toBe('Expected behavior is verified')
      expect(expectedResult.length).toBeGreaterThan(10)
      // Should end with proper punctuation
      expect(expectedResult).toMatch(/[.!?]$/)
    })

    it('should handle Gherkin format correctly', async () => {
      const projectInfo =
        'AC1: Given I am logged in, When I click the button, Then I should see the page.'
      const result = await generateIntelligentTestCases(projectInfo, 'gherkin', null, 1, false)

      expect(result.length).toBeGreaterThan(0)
      const steps = result[0].steps

      // Should contain Gherkin keywords
      expect(steps).toMatch(/Given|When|Then/i)
    })
  })

  describe('analyzeProjectInfo', () => {
    it('should detect functionalities from keywords', () => {
      const projectInfo =
        'The user can login with username and password. Then they can create a new record.'
      const analysis = analyzeProjectInfo(projectInfo)

      expect(analysis).not.toBeNull()
      expect(analysis.detectedFunctionalities.length).toBeGreaterThan(0)

      // Should detect authentication
      const authFunc = analysis.detectedFunctionalities.find(f => f.type === 'authentication')
      expect(authFunc).toBeDefined()

      // Should detect CRUD
      const crudFunc = analysis.detectedFunctionalities.find(f => f.type === 'crud')
      expect(crudFunc).toBeDefined()
    })

    it('should not detect performance edge case for view/browse actions', () => {
      const projectInfo =
        'AC1: Given I view the page, When I browse provinces, Then I should see a list.'
      const analysis = analyzeProjectInfo(projectInfo)

      expect(analysis).not.toBeNull()
      // Should not have performance in edge cases for simple view/browse
      if (analysis.edgeCases && analysis.edgeCases.length > 0) {
        expect(analysis.edgeCases).not.toContain('performance')
      }
    })
  })
})
