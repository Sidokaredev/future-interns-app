export type DataOptions = {
  withOrigin: boolean;
  precision?: number | undefined;
}

export type InitData = {
  label: string;
  criteria: Set<[string, string]>;
  weights: Set<[string, number]>;
}

export type NormalizedProps<T> = {
  normalized: Record<string, number>;
  origin?: T;
}

export type PreferencesProps<T> = {
  normalized: Record<string, number>;
  weightedNormalizedDecisionMatrix: Record<string, number>;
  finalPreferenceValue: number;
  origin?: T;
}

const defaultOptions: DataOptions = {
  withOrigin: false,
  precision: undefined,
}
/**
 * next -> add ommited keys from calculating.
 */
export class SAW<AltType extends Record<string, string | number>> {
  label: string
  private criteria: Set<[string, string]>
  private weights: Set<[string, number]>
  private options: DataOptions;

  private alternatives: AltType[] = [];
  private idealValues: Map<string, number> = new Map();
  private normalizedAlternativesArray: NormalizedProps<AltType>[] = [];
  private preferences: PreferencesProps<AltType>[] = [];

  constructor(init: InitData, options: DataOptions = defaultOptions) {
    this.label = init.label;
    this.criteria = init.criteria;
    this.weights = init.weights;
    this.options = options;
  }

  private CostFn(value: number, idealWorstValue: number): number {
    const regularizationTerm = 0.01; // menghindari pembagian dengan nol
    if (value === 0 && idealWorstValue === 0) {
      return 0;
    }
    if (value === 0 && idealWorstValue !== 0) {
      value += regularizationTerm;
      idealWorstValue += regularizationTerm;
    }

    return idealWorstValue / value;
  }
  private BenefitFn(value: number, idealBestValue: number): number {
    const regularizationTerm = 0.01;
    if (idealBestValue === 0 && value === 0) {
      return 0;
    }
    if (idealBestValue === 0 && value !== 0) {
      idealBestValue += regularizationTerm;
      value += regularizationTerm;
    }

    return value / idealBestValue;
  }
  StoreAlternatives(alternatives: AltType[]) {
    this.alternatives = alternatives;

    /**
     * Initial ideal value (A+ or A-)
     */
    for (const [key, value] of Object.entries(alternatives[0])) {
      this.idealValues.set(key, value as number)
    }
    /**
     * Ideal value for Cost and Benefit
     */
    this.alternatives.forEach((alternative, _) => {
      for (const key in alternative) {
        for (const [criterion, type] of this.criteria) {
          if (key === criterion) {
            let idealValue = this.idealValues.get(key);
            if (type === "cost") {
              if (idealValue !== undefined && (alternative[key] as number < idealValue)) {
                this.idealValues.set(key, alternative[key] as number);

                continue;
              }
            }

            if (type === "benefit") {
              if (idealValue !== undefined && (alternative[key] as number > idealValue)) {
                this.idealValues.set(key, alternative[key] as number);

                continue;
              }
            }
          }

          continue;
        }
      }
    });
    /**
     * Normalization
     */
    this.alternatives.forEach((alternative, _) => {
      let normalizedAlternativeRecord: Record<string, number> = {};
      for (const key in alternative) {
        for (const [criterion, type] of this.criteria) {
          if (key === criterion) {
            let idealValue = this.idealValues.get(key);
            if (idealValue === undefined) {
              throw new Error(`normalize criterion value of '${key}' doesn't exist`);
            }
            if (type === "cost") {
              let normalizedCostValue = this.CostFn(alternative[key] as number, idealValue);
              normalizedAlternativeRecord[key] = normalizedCostValue;

              continue;
            }

            if (type === "benefit") {
              let normalizedBenefitValue = this.BenefitFn(alternative[key] as number, idealValue);
              normalizedAlternativeRecord[key] = normalizedBenefitValue;

              continue;
            }
          }
        }
      }
      let normalizedAlternative: NormalizedProps<AltType>;
      if (this.options.withOrigin) {
        normalizedAlternative = {
          normalized: normalizedAlternativeRecord,
          origin: alternative
        }
      } else {
        normalizedAlternative = {
          normalized: normalizedAlternativeRecord,
        }
      }
      this.normalizedAlternativesArray.push(normalizedAlternative);
    });
    /**
     * Calculating Preference Values
     */
    this.normalizedAlternativesArray.forEach((alternative, _) => {
      let finalPreferenceValue: number = 0;
      const weightedNormalizedDecisionMatrix: Record<string, number> = {};
      for (const key in alternative.normalized) {
        for (const [criterion, weight] of this.weights) {
          if (key === criterion) {
            finalPreferenceValue += (weight * alternative.normalized[key]);
            weightedNormalizedDecisionMatrix[key] = (alternative.normalized[key] * weight)
          }
        }
      }
      let preference: PreferencesProps<AltType>;
      if (this.options.withOrigin) {
        preference = {
          normalized: alternative.normalized,
          weightedNormalizedDecisionMatrix: weightedNormalizedDecisionMatrix,
          finalPreferenceValue: finalPreferenceValue,
          origin: alternative.origin
        }
      } else {
        preference = {
          normalized: alternative.normalized,
          weightedNormalizedDecisionMatrix: weightedNormalizedDecisionMatrix,
          finalPreferenceValue: finalPreferenceValue,
        }
      }
      this.preferences.push(preference);
    });

    return this;
  }
  GetCriteriaRecord(): Record<string, string> {
    let criteriaRecord: Record<string, string> = {};

    for (const [criterion, attribute] of this.criteria) {
      criteriaRecord[criterion] = attribute
    }

    return criteriaRecord;
  }
  GetWeightRecord(): Record<string, number> {
    let weightsRecord: Record<string, number> = {};

    for (const [criterion, weight] of this.weights) {
      weightsRecord[criterion] = weight
    }

    return weightsRecord
  }
  GetAlternatives(): AltType[] {
    return this.alternatives;
  }
  GetIdealValuesRecord(): Record<string, number> {
    let idealValuesRecord: Record<string, number> = {};
    for (const [key, value] of this.idealValues) {
      idealValuesRecord[key] = value;
    }
    return idealValuesRecord;
  }
  GetNormalizedArr(options: {
    precision: number | undefined;
  } = { precision: this.options.precision }): NormalizedProps<AltType>[] {
    let normalizedArr = this.normalizedAlternativesArray.map(alt => {
      for (const [key, value] of Object.entries(alt.normalized)) {
        alt.normalized[key] = Number.parseFloat(value.toPrecision(options.precision));
      }
      return alt;
    });
    return normalizedArr;
  }
  GetPreferences(options: {
    precision: number | undefined;
  } = { precision: this.options.precision }): PreferencesProps<AltType>[] {
    let preferences = this.preferences.map(alt => {
      for (const [key, value] of Object.entries(alt.weightedNormalizedDecisionMatrix)) {
        alt.weightedNormalizedDecisionMatrix[key] = Number.parseFloat(value.toPrecision(options.precision));
        alt.finalPreferenceValue = Number.parseFloat(alt.finalPreferenceValue.toPrecision(options.precision));
      }
      for (const [key, value] of Object.entries(alt.normalized)) {
        alt.normalized[key] = Number.parseFloat(value.toPrecision(options.precision));
      }
      return alt;
    });
    return preferences;
  }
  GetRanking(options: {
    precision: number | undefined;
  } = { precision: this.options.precision }): PreferencesProps<AltType>[] {
    let preferences = this.preferences.map(alt => {
      for (const [key, value] of Object.entries(alt.weightedNormalizedDecisionMatrix)) {
        alt.weightedNormalizedDecisionMatrix[key] = Number.parseFloat(value.toPrecision(options.precision));
        alt.finalPreferenceValue = Number.parseFloat(alt.finalPreferenceValue.toPrecision(options.precision));
      }
      for (const [key, value] of Object.entries(alt.normalized)) {
        alt.normalized[key] = Number.parseFloat(value.toPrecision(options.precision));
      }
      return alt;
    }).sort((altA, altB) => altB.finalPreferenceValue - altA.finalPreferenceValue);

    return preferences;
  }
  FindRank(P: PreferencesProps<AltType>): number {
    const sortedPreferences = this.preferences.sort((pA, pB) => pB.finalPreferenceValue - pA.finalPreferenceValue);
    return sortedPreferences.findIndex(p => p === P);
  }
};