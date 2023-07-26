module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.ts"],
} 