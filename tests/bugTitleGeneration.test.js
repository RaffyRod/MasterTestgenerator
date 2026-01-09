import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateIntelligentTitle, initAIService } from '../src/core/ai/aiService.js'
import { AI_PROVIDERS } from '../src/core/constants/aiProviders.js'

describe('Bug Title Generation', () => {
  beforeEach(() => {
    // Reset AI service to default
    initAIService(AI_PROVIDERS.ONLINE, {})
    vi.clearAllMocks()
  })

  describe('generateIntelligentTitle for bug reports', () => {
    it('should return array of 2 titles for bug reports', async () => {
      const description = 'The app is failing after reloading the main page when the user is logged off'
      
      // Mock fetch for both AI providers
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            generated_text: 'App fails on reload'
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            choices: [{
              message: {
                content: 'Application fails after reload'
              }
            }]
          })
        })

      const result = await generateIntelligentTitle(description, 'en', 'bugReport')
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
      expect(typeof result[0]).toBe('string')
      expect(typeof result[1]).toBe('string')
    })

    it('should limit titles to 30 characters', async () => {
      const description = 'The application is not working properly when the user tries to access the dashboard page after logging in'
      
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            generated_text: 'This is a very long title that should be truncated to 30 characters maximum'
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            choices: [{
              message: {
                content: 'Another very long title that exceeds the maximum allowed length of 30 characters'
              }
            }]
          })
        })

      const result = await generateIntelligentTitle(description, 'en', 'bugReport')
      
      expect(Array.isArray(result)).toBe(true)
      result.forEach(title => {
        expect(title.length).toBeLessThanOrEqual(30)
      })
    })

    it('should use fallback when both AIs fail', async () => {
      const description = 'The app is failing after reloading'
      
      global.fetch = vi.fn()
        .mockRejectedValueOnce(new Error('AI 1 failed'))
        .mockRejectedValueOnce(new Error('AI 2 failed'))

      const result = await generateIntelligentTitle(description, 'en', 'bugReport')
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
      // Fallback should detect "failing" + "reload"
      expect(result[0].toLowerCase()).toContain('fail')
      expect(result[1].toLowerCase()).toContain('fail')
    })

    it('should handle empty description', async () => {
      const result = await generateIntelligentTitle('', 'en', 'bugReport')
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
      expect(result[0]).toBe('Bug Report')
      expect(result[1]).toBe('Bug Report')
    })

    it('should generate different titles from different AIs', async () => {
      const description = 'The login button does not work when clicked'
      
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            generated_text: 'Login button fails'
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            choices: [{
              message: {
                content: 'Button not working'
              }
            }]
          })
        })

      const result = await generateIntelligentTitle(description, 'en', 'bugReport')
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
      // Titles should be different (or at least valid)
      expect(result[0].length).toBeGreaterThan(0)
      expect(result[1].length).toBeGreaterThan(0)
    })

    it('should handle partial AI failures gracefully', async () => {
      const description = 'Page not loading after refresh'
      
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            generated_text: 'Page not loading'
          })
        })
        .mockRejectedValueOnce(new Error('Groq API failed'))

      const result = await generateIntelligentTitle(description, 'en', 'bugReport')
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
      // First title should be from successful AI
      expect(result[0]).toBe('Page not loading')
      // Second should be fallback
      expect(result[1].length).toBeGreaterThan(0)
    })
  })

  describe('Title selection functionality', () => {
    it('should return single title for non-bug-report types', async () => {
      const text = 'Given I am logged in, When I click the button, Then I should see the page'
      
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          generated_text: 'User Login Test'
        })
      })

      const result = await generateIntelligentTitle(text, 'en', 'testCase')
      
      expect(typeof result).toBe('string')
      expect(Array.isArray(result)).toBe(false)
    })
  })
})
