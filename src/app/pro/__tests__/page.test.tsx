import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProPage from '../page'
import type { User } from '@clerk/nextjs/server'

// Mock Clerk authentication
vi.mock('@clerk/nextjs/server', () => ({
  currentUser: vi.fn(),
  auth: vi.fn(),
}))

// Mock Clerk components
vi.mock('@clerk/nextjs', () => ({
  PricingTable: () => <div data-testid="pricing-table">Pricing Table</div>,
  useUser: vi.fn(() => ({
    user: { firstName: 'Test', lastName: 'User', emailAddresses: [{ emailAddress: 'test@example.com' }] },
  })),
  UserButton: () => <div data-testid="user-button">User Button</div>,
}))

// Mock Navbar component
vi.mock('@/components/NavBar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  CrownIcon: (props: any) => <svg data-testid="crown-icon" {...props}>Crown</svg>,
  HomeIcon: (props: any) => <svg data-testid="home-icon" {...props}>Home</svg>,
  CalendarIcon: (props: any) => <svg data-testid="calendar-icon" {...props}>Calendar</svg>,
  MicIcon: (props: any) => <svg data-testid="mic-icon" {...props}>Mic</svg>,
}))

describe('ProPage', () => {
  const { currentUser, auth } = await import('@clerk/nextjs/server')
  const { redirect } = await import('next/navigation')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Authentication and Authorization', () => {
    it('should redirect to home page when user is not authenticated', async () => {
      // Arrange
      vi.mocked(currentUser).mockResolvedValue(null)

      // Act & Assert
      await expect(async () => {
        await ProPage()
      }).rejects.toThrow('NEXT_REDIRECT: /')

      expect(currentUser).toHaveBeenCalledOnce()
      expect(redirect).toHaveBeenCalledWith('/')
    })

    it('should not redirect when user is authenticated', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_123',
        firstName: 'John',
        lastName: 'Doe',
        emailAddresses: [
          { emailAddress: 'john@example.com' } as any,
        ],
      }

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: vi.fn().mockReturnValue(false),
      } as any)

      // Act
      const result = await ProPage()

      // Assert
      expect(currentUser).toHaveBeenCalledOnce()
      expect(redirect).not.toHaveBeenCalled()
      expect(result).toBeDefined()
    })

    it('should check for ai_basic plan', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_123',
        firstName: 'John',
        lastName: 'Doe',
      }

      const mockHas = vi.fn()
        .mockReturnValueOnce(true) // ai_basic plan
        .mockReturnValueOnce(false) // ai_pro plan

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: mockHas,
      } as any)

      // Act
      await ProPage()

      // Assert
      expect(mockHas).toHaveBeenCalledWith({ plan: 'ai_basic' })
      expect(mockHas).toHaveBeenCalledWith({ plan: 'ai_pro' })
    })

    it('should check for ai_pro plan', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_123',
        firstName: 'Jane',
        lastName: 'Smith',
      }

      const mockHas = vi.fn()
        .mockReturnValueOnce(false) // ai_basic plan
        .mockReturnValueOnce(true) // ai_pro plan

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: mockHas,
      } as any)

      // Act
      await ProPage()

      // Assert
      expect(mockHas).toHaveBeenCalledWith({ plan: 'ai_basic' })
      expect(mockHas).toHaveBeenCalledWith({ plan: 'ai_pro' })
    })

    it('should correctly determine hasProPlan when user has ai_basic', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_123',
      }

      const mockHas = vi.fn()
        .mockReturnValueOnce(true) // ai_basic
        .mockReturnValueOnce(false) // ai_pro

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: mockHas,
      } as any)

      // Spy on console.log
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Act
      await ProPage()

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith({ hasProPlan: true })
      consoleSpy.mockRestore()
    })

    it('should correctly determine hasProPlan when user has ai_pro', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_456',
      }

      const mockHas = vi.fn()
        .mockReturnValueOnce(false) // ai_basic
        .mockReturnValueOnce(true) // ai_pro

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: mockHas,
      } as any)

      // Spy on console.log
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Act
      await ProPage()

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith({ hasProPlan: true })
      consoleSpy.mockRestore()
    })

    it('should correctly determine hasProPlan when user has neither plan', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_789',
      }

      const mockHas = vi.fn().mockReturnValue(false)

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: mockHas,
      } as any)

      // Spy on console.log
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Act
      await ProPage()

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith({ hasProPlan: false })
      consoleSpy.mockRestore()
    })
  })

  describe('Component Rendering', () => {
    beforeEach(() => {
      const mockUser: Partial<User> = {
        id: 'user_123',
        firstName: 'John',
        lastName: 'Doe',
      }

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: vi.fn().mockReturnValue(false),
      } as any)
    })

    it('should render Navbar component', async () => {
      // Act
      const result = await ProPage()
      render(result)

      // Assert
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
    })

    it('should render main heading text', async () => {
      // Act
      const result = await ProPage()
      render(result)

      // Assert
      expect(screen.getByText('Unlock Premium AI Dental Care')).toBeInTheDocument()
    })

    it('should render "Upgrade to Pro" badge', async () => {
      // Act
      const result = await ProPage()
      render(result)

      // Assert
      expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument()
    })

    it('should render description text', async () => {
      // Act
      const result = await ProPage()
      render(result)

      // Assert
      expect(screen.getByText(/Get unlimited AI consultations, advanced features, and priority support/i)).toBeInTheDocument()
    })

    it('should render CrownIcon', async () => {
      // Act
      const result = await ProPage()
      render(result)

      // Assert
      expect(screen.getByTestId('crown-icon')).toBeInTheDocument()
    })

    it('should render "Choose Your Plan" heading', async () => {
      // Act
      const result = await ProPage()
      render(result)

      // Assert
      expect(screen.getByText('Choose Your Plan')).toBeInTheDocument()
    })

    it('should render pricing section description', async () => {
      // Act
      const result = await ProPage()
      render(result)

      // Assert
      expect(screen.getByText(/Select the perfect plan for your dental care needs/i)).toBeInTheDocument()
    })

    it('should render PricingTable component', async () => {
      // Act
      const result = await ProPage()
      render(result)

      // Assert
      expect(screen.getByTestId('pricing-table')).toBeInTheDocument()
    })

    it('should render all required text content for security assurance', async () => {
      // Act
      const result = await ProPage()
      render(result)

      // Assert
      expect(screen.getByText(/bank-level encryption/i)).toBeInTheDocument()
    })
  })

  describe('Layout and Structure', () => {
    beforeEach(() => {
      const mockUser: Partial<User> = {
        id: 'user_123',
        firstName: 'John',
        lastName: 'Doe',
      }

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: vi.fn().mockReturnValue(false),
      } as any)
    })

    it('should apply correct max-width container class', async () => {
      // Act
      const result = await ProPage()
      const { container } = render(result)

      // Assert
      const mainContainer = container.querySelector('.max-w-7xl')
      expect(mainContainer).toBeInTheDocument()
    })

    it('should have proper spacing classes on main container', async () => {
      // Act
      const result = await ProPage()
      const { container } = render(result)

      // Assert
      const mainContainer = container.querySelector('.max-w-7xl')
      expect(mainContainer).toHaveClass('mx-auto', 'px-6', 'py-8', 'pt-24')
    })

    it('should render gradient background on hero section', async () => {
      // Act
      const result = await ProPage()
      const { container } = render(result)

      // Assert
      const gradientSection = container.querySelector('.bg-gradient-to-br')
      expect(gradientSection).toBeInTheDocument()
    })

    it('should have animated pulse effect on badge', async () => {
      // Act
      const result = await ProPage()
      const { container } = render(result)

      // Assert
      const pulseElement = container.querySelector('.animate-pulse')
      expect(pulseElement).toBeInTheDocument()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle currentUser returning null gracefully', async () => {
      // Arrange
      vi.mocked(currentUser).mockResolvedValue(null)

      // Act & Assert
      await expect(async () => {
        await ProPage()
      }).rejects.toThrow('NEXT_REDIRECT: /')
    })

    it('should handle currentUser returning undefined gracefully', async () => {
      // Arrange
      vi.mocked(currentUser).mockResolvedValue(undefined as any)

      // Act & Assert
      await expect(async () => {
        await ProPage()
      }).rejects.toThrow('NEXT_REDIRECT: /')
    })

    it('should handle auth function errors gracefully', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_123',
      }

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockRejectedValue(new Error('Auth service unavailable'))

      // Act & Assert
      await expect(async () => {
        await ProPage()
      }).rejects.toThrow('Auth service unavailable')
    })

    it('should handle user with minimal data', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_minimal',
      }

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: vi.fn().mockReturnValue(false),
      } as any)

      // Act
      const result = await ProPage()

      // Assert
      expect(result).toBeDefined()
      render(result)
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
    })

    it('should handle multiple plan checks correctly with both plans', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_both_plans',
        firstName: 'Premium',
        lastName: 'User',
      }

      const mockHas = vi.fn().mockReturnValue(true) // Has both plans

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: mockHas,
      } as any)

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Act
      await ProPage()

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith({ hasProPlan: true })
      expect(mockHas).toHaveBeenCalledTimes(2)
      consoleSpy.mockRestore()
    })
  })

  describe('Console Logging', () => {
    it('should log hasProPlan status to console', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_123',
      }

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: vi.fn().mockReturnValue(false),
      } as any)

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Act
      await ProPage()

      // Assert
      expect(consoleSpy).toHaveBeenCalledOnce()
      expect(consoleSpy).toHaveBeenCalledWith({ hasProPlan: expect.any(Boolean) })

      consoleSpy.mockRestore()
    })

    it('should log correct boolean value for hasProPlan', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_123',
      }

      const mockHas = vi.fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: mockHas,
      } as any)

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Act
      await ProPage()

      // Assert
      const logCall = consoleSpy.mock.calls[0][0]
      expect(typeof logCall.hasProPlan).toBe('boolean')

      consoleSpy.mockRestore()
    })
  })

  describe('Integration Tests', () => {
    it('should complete full authentication and rendering flow for authenticated user', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_integration',
        firstName: 'Integration',
        lastName: 'Test',
        emailAddresses: [
          { emailAddress: 'integration@test.com' } as any,
        ],
      }

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: vi.fn().mockReturnValue(false),
      } as any)

      // Act
      const result = await ProPage()
      render(result)

      // Assert - Check complete page structure
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByText('Unlock Premium AI Dental Care')).toBeInTheDocument()
      expect(screen.getByText('Choose Your Plan')).toBeInTheDocument()
      expect(screen.getByTestId('pricing-table')).toBeInTheDocument()
      expect(screen.getByTestId('crown-icon')).toBeInTheDocument()
    })

    it('should handle complete flow for user with pro plan', async () => {
      // Arrange
      const mockUser: Partial<User> = {
        id: 'user_pro',
        firstName: 'Pro',
        lastName: 'User',
      }

      const mockHas = vi.fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)

      vi.mocked(currentUser).mockResolvedValue(mockUser as User)
      vi.mocked(auth).mockResolvedValue({
        has: mockHas,
      } as any)

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Act
      const result = await ProPage()
      render(result)

      // Assert - Verify all aspects
      expect(currentUser).toHaveBeenCalled()
      expect(mockHas).toHaveBeenCalledWith({ plan: 'ai_basic' })
      expect(mockHas).toHaveBeenCalledWith({ plan: 'ai_pro' })
      expect(consoleSpy).toHaveBeenCalledWith({ hasProPlan: true })
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('pricing-table')).toBeInTheDocument()

      consoleSpy.mockRestore()
    })
  })
})