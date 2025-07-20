/**
 * Financial Agent Module
 * Basic implementation for financial agent interfaces
 */

export interface FinancialAgent {
  id: string;
  type: string;
  state: AgentState;
  processMessage(message: AgentMessage): Promise<void>;
  processInput(input: any): Promise<any>;
}

export interface AgentState {
  status: 'active' | 'inactive' | 'processing';
  lastUpdate: Date;
  data: Record<string, any>;
  type: string;
}

export interface AgentMessage {
  id: string;
  type: string;
  payload: any;
  timestamp: Date;
  priority: number;
  from: string;
}

export class BasicFinancialAgent implements FinancialAgent {
  public id: string;
  public type: string;
  public state: AgentState;

  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
    this.state = {
      status: 'active',
      lastUpdate: new Date(),
      data: {},
      type: type,
    };
  }

  async processMessage(message: AgentMessage): Promise<void> {
    this.state.lastUpdate = new Date();
    this.state.status = 'processing';
    // Basic message processing
    this.state.data[message.id] = message.payload;
    this.state.status = 'active';
  }

  async processInput(input: any): Promise<any> {
    this.state.lastUpdate = new Date();
    return { processed: true, input: input, timestamp: new Date() };
  }
}