// Shared ID generation utility
export class IdGenerator {
  static uuid(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  static entityId(prefix: string): string {
    return `${prefix}-${this.uuid()}`
  }
}
