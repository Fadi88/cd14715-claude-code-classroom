# Solution: TDD Strategy for Shopping Cart Module

Complete solution with all gaps fixed and comprehensive test coverage.

## What's Included

- **tdd-strategy.md** - Complete TDD strategy document
- **src/shopping-cart.ts** - Full implementation with all validations
- **src/shopping-cart.test.ts** - 40+ comprehensive tests

## Gaps Fixed

1. **Inventory validation** - Checks stock before adding
2. **Quantity validation** - Rejects negative/invalid values
3. **Promo code validation** - Expiration, usage limits, minimums
4. **Currency precision** - Rounds to 2 decimal places
5. **Discount caps** - Respects maxDiscount field

## Run

```bash
npm install
npm start              # See solution demo
npm test               # All 40+ tests pass
npm run test:coverage  # 95%+ coverage
```

## Key Learning Points

1. **Requirements drive tests** - Clear specs enable AI generation
2. **Edge cases need human insight** - Business rules AI won't know
3. **Coverage targets should be pragmatic** - 95% for logic, lower for logging
4. **Validate AI-generated tests** - Check assertions match requirements
