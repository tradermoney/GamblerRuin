import type { SimulationConfig } from '../types/simulation';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * 验证模拟配置的所有参数
 */
export function validateSimulationConfig(config: SimulationConfig): ValidationResult {
  const errors: ValidationError[] = [];

  // 验证初始资金
  if (!Number.isFinite(config.initialCapital)) {
    errors.push({
      field: 'initialCapital',
      message: '初始资金必须是有效数字'
    });
  } else if (config.initialCapital <= 0) {
    errors.push({
      field: 'initialCapital',
      message: '初始资金必须大于0'
    });
  } else if (config.initialCapital > Number.MAX_SAFE_INTEGER) {
    errors.push({
      field: 'initialCapital',
      message: '初始资金超出最大安全范围'
    });
  }

  // 验证目标资金
  if (config.targetCapital !== null) {
    if (!Number.isFinite(config.targetCapital)) {
      errors.push({
        field: 'targetCapital',
        message: '目标资金必须是有效数字'
      });
    } else if (config.targetCapital <= 0) {
      errors.push({
        field: 'targetCapital',
        message: '目标资金必须大于0'
      });
    } else if (config.targetCapital <= config.initialCapital) {
      errors.push({
        field: 'targetCapital',
        message: '目标资金必须大于初始资金'
      });
    } else if (config.targetCapital > Number.MAX_SAFE_INTEGER) {
      errors.push({
        field: 'targetCapital',
        message: '目标资金超出最大安全范围'
      });
    }
  }

  // 验证单轮赌注
  if (!Number.isFinite(config.betSize)) {
    errors.push({
      field: 'betSize',
      message: '单轮赌注必须是有效数字'
    });
  } else if (config.betSize <= 0) {
    errors.push({
      field: 'betSize',
      message: '单轮赌注必须大于0'
    });
  } else if (config.betSize > config.initialCapital) {
    errors.push({
      field: 'betSize',
      message: '单轮赌注不能大于初始资金'
    });
  }

  // 验证胜率
  if (!Number.isFinite(config.winProb)) {
    errors.push({
      field: 'winProb',
      message: '胜率必须是有效数字'
    });
  } else if (config.winProb < 0 || config.winProb > 1) {
    errors.push({
      field: 'winProb',
      message: '胜率必须在0到1之间'
    });
  }

  // 验证赔率
  if (!Number.isFinite(config.oddRatio)) {
    errors.push({
      field: 'oddRatio',
      message: '赔率必须是有效数字'
    });
  } else if (config.oddRatio <= 0) {
    errors.push({
      field: 'oddRatio',
      message: '赔率必须大于0'
    });
  }

  // 验证最大轮数
  if (!Number.isFinite(config.maxRounds)) {
    errors.push({
      field: 'maxRounds',
      message: '最大轮数必须是有效数字'
    });
  } else if (!Number.isInteger(config.maxRounds)) {
    errors.push({
      field: 'maxRounds',
      message: '最大轮数必须是整数'
    });
  } else if (config.maxRounds <= 0) {
    errors.push({
      field: 'maxRounds',
      message: '最大轮数必须大于0'
    });
  } else if (config.maxRounds > 10000000) {
    errors.push({
      field: 'maxRounds',
      message: '最大轮数不能超过1000万（性能限制）'
    });
  }

  // 验证批量模拟次数
  if (!Number.isFinite(config.runs)) {
    errors.push({
      field: 'runs',
      message: '批量模拟次数必须是有效数字'
    });
  } else if (!Number.isInteger(config.runs)) {
    errors.push({
      field: 'runs',
      message: '批量模拟次数必须是整数'
    });
  } else if (config.runs <= 0) {
    errors.push({
      field: 'runs',
      message: '批量模拟次数必须大于0'
    });
  } else if (config.runs > 1000000) {
    errors.push({
      field: 'runs',
      message: '批量模拟次数不能超过100万（性能限制）'
    });
  }

  // 验证策略特定参数
  if (config.strategy === 'proportional') {
    if (config.proportion === undefined) {
      errors.push({
        field: 'proportion',
        message: '使用比例策略时必须设置投注比例'
      });
    } else if (!Number.isFinite(config.proportion)) {
      errors.push({
        field: 'proportion',
        message: '投注比例必须是有效数字'
      });
    } else if (config.proportion <= 0 || config.proportion > 1) {
      errors.push({
        field: 'proportion',
        message: '投注比例必须在0到1之间'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 安全地解析数字输入
 */
export function safeParseNumber(value: string | number, defaultValue: number = 0): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : defaultValue;
  }
  
  const trimmed = value.trim();
  if (trimmed === '') {
    return defaultValue;
  }
  
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

/**
 * 安全地解析整数输入
 */
export function safeParseInt(value: string | number, defaultValue: number = 0): number {
  const num = safeParseNumber(value, defaultValue);
  return Math.floor(num);
}

/**
 * 限制数字在指定范围内
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * 验证并清理配置
 */
export function sanitizeConfig(config: Partial<SimulationConfig>): Partial<SimulationConfig> {
  const sanitized: Partial<SimulationConfig> = {};

  if (config.initialCapital !== undefined) {
    sanitized.initialCapital = Math.max(1, safeParseNumber(config.initialCapital, 10));
  }

  if (config.targetCapital !== undefined) {
    if (config.targetCapital === null) {
      sanitized.targetCapital = null;
    } else {
      const target = safeParseNumber(config.targetCapital, 0);
      sanitized.targetCapital = target > 0 ? target : null;
    }
  }

  if (config.betSize !== undefined) {
    sanitized.betSize = Math.max(1, safeParseNumber(config.betSize, 1));
  }

  if (config.winProb !== undefined) {
    sanitized.winProb = clamp(safeParseNumber(config.winProb, 0.5), 0, 1);
  }

  if (config.oddRatio !== undefined) {
    sanitized.oddRatio = Math.max(0.1, safeParseNumber(config.oddRatio, 1));
  }

  if (config.maxRounds !== undefined) {
    sanitized.maxRounds = clamp(safeParseInt(config.maxRounds, 10000), 1, 10000000);
  }

  if (config.runs !== undefined) {
    sanitized.runs = clamp(safeParseInt(config.runs, 10000), 1, 1000000);
  }

  if (config.strategy !== undefined) {
    sanitized.strategy = config.strategy;
  }

  if (config.proportion !== undefined) {
    sanitized.proportion = clamp(safeParseNumber(config.proportion, 0.1), 0.01, 1);
  }

  if (config.seed !== undefined) {
    sanitized.seed = config.seed;
  }

  return sanitized;
}

