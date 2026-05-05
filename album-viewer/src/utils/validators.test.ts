import {describe, expect, it} from 'vitest'
import { validateDate, validateIPV6 } from './validators'

describe('validateDate', () => {
    it('should return a Date object for valid date input', () => {
        const result = validateDate('15/08/2024')
        expect(result).toBeInstanceOf(Date)
    })

    it('should return null for invalid date input', () => {
        const result = validateDate('31/02/2024')
        expect(result).toBeNull()
    })
})

