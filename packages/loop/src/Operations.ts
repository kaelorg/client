class Operations extends Map<number, OperationData> {
  public setOperation(operationData: OperationData): this {
    return super.set(this.last, operationData);
  }

  get last(): number {
    return this.size;
  }

  get array(): OperationValue[] {
    return Array.from(
      super.entries(),
    ).map(([operation, { time, success }]) => ({ time, success, operation }));
  }
}

interface OperationValue extends OperationData {
  operation: number;
}

interface OperationData {
  time: number;
  success: boolean;
}

export default Operations;
