import {parseTimeInput} from "./formatTime"
import { describe, it, expect } from "vitest"

describe("Tests in formatTime - valid inputs ", () => {
  it('should return time in seconds for valid colon format "25:00"', () => {
    const input ='25:00'
    expect(parseTimeInput(input)).toBe(1500)
  });

  it('should return time in seconds for valid colon format "5:30"', () => {
    const input ='5:30'
    expect(parseTimeInput(input)).toBe(330)
  });

  it('should return time in seconds for valid bare minutes "30" ', () => {
    const input ='30'
    expect(parseTimeInput(input)).toBe(1800)
  });

  it('should return time in seconds for valid bare minutes "1" ', () => {
    const input ='1'
    expect(parseTimeInput(input)).toBe(60)
  })
})

describe("Tests in formatTime - invalid inputs ", () => {
  it('should return null for input with letters "25a:00"', () => {
    const input = '25a:00'
    expect(parseTimeInput(input)).toBeNull()
  });

  it('should return null for minutes out of range (> 60) "75:30"', () => {
    const input = '75:30'
    expect(parseTimeInput(input)).toBeNull()
  });

  it('should return null for seconds out of range (> 59) "25:75"', () => {
    const input = '25:75'
    expect(parseTimeInput(input)).toBeNull()
  });

  it('should return null for zero duration "0:00"', () => {
    const input = '0:00'
    expect(parseTimeInput(input)).toBeNull()
  });

  it('should return null for negative minutes "-5:30"', () => {
    const input = '-5:30'
    expect(parseTimeInput(input)).toBeNull()
  });

  it('should return null for empty string ""', () => {
    const input = ''
    expect(parseTimeInput(input)).toBeNull()
  });
})

