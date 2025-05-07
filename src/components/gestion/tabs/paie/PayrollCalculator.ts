
/**
 * Classe utilitaire pour le calcul des salaires et charges
 */
export class PayrollCalculator {
  // Constantes pour le calcul des charges sociales et fiscales
  private static CHARGES_SOCIALES = {
    // CNPS
    plafondCNPS: 750000,
    pensionVieillesseEmployeur: 4.20,
    pensionVieillesseSalarie: 4.20,
    prestationsFamiliales: {
      general: 7.0,
      agricole: 5.65,
      enseignementPrive: 3.70
    },
    accidentsTravail: {
      risqueFaible: 1.75,
      risqueMoyen: 2.50,
      risqueEleve: 5.0
    },
    // Fonds National de l'Emploi
    fne: 1.0,
    // Crédit Foncier du Cameroun (CFC)
    cfcEmploye: 1.0,
    cfcEmployeur: 1.5
  };
  
  private static CHARGES_FISCALES = {
    // IRPP
    abattementForfaitaire: 30, // 30% pour frais professionnels
    abattementAnnuel: 500000, // 500 000 FCFA par an
    seuilImposition: 62000, // Pas d'IRPP en-dessous
    tranches: [
      { min: 0, max: 2000000, taux: 10 }, // Annuel
      { min: 2000001, max: 3000000, taux: 15 },
      { min: 3000001, max: 5000000, taux: 25 },
      { min: 5000001, max: Infinity, taux: 35 }
    ],
    // Centimes Additionnels Communaux (CAC)
    tauxCAC: 10, // 10% de l'IRPP
    // Redevance Audiovisuelle (RAV)
    baremesRAV: [
      { min: 0, max: 50000, montant: 0 },
      { min: 50001, max: 100000, montant: 750 },
      { min: 100001, max: 200000, montant: 1950 },
      { min: 200001, max: 300000, montant: 3250 },
      { min: 300001, max: 400000, montant: 4550 },
      { min: 400001, max: 500000, montant: 5850 },
      { min: 500001, max: 600000, montant: 7150 },
      { min: 600001, max: 700000, montant: 8450 },
      { min: 700001, max: 800000, montant: 9750 },
      { min: 800001, max: 900000, montant: 11050 },
      { min: 900001, max: 1000000, montant: 12350 },
      { min: 1000001, max: Infinity, montant: 13000 }
    ],
    // Taxe de Développement Local (TDL)
    baremesTDL: [
      { min: 0, max: 62000, montant: 0 },
      { min: 62000, max: 75000, montant: 250 }, // Par mois (3000/an)
      { min: 75001, max: 100000, montant: 500 }, // Par mois (6000/an)
      { min: 100001, max: 125000, montant: 750 }, // Par mois (9000/an)
      { min: 125001, max: 150000, montant: 1000 }, // Par mois (12000/an)
      { min: 150001, max: 200000, montant: 1250 }, // Par mois (15000/an)
      { min: 200001, max: 250000, montant: 1500 }, // Par mois (18000/an)
      { min: 250001, max: 300000, montant: 2000 }, // Par mois (24000/an)
      { min: 300001, max: 500000, montant: 2250 }, // Par mois (27000/an)
      { min: 500001, max: Infinity, montant: 2500 } // Par mois (30000/an)
    ]
  };

  /**
   * Calcule la cotisation CNPS à payer par l'employé
   */
  static calculateCNPSEmployee(grossSalary: number): number {
    const plafond = this.CHARGES_SOCIALES.plafondCNPS;
    const tauxCNPS = this.CHARGES_SOCIALES.pensionVieillesseSalarie;
    const baseCotisation = Math.min(grossSalary, plafond);
    return Math.round((baseCotisation * tauxCNPS) / 100);
  }

  /**
   * Calcule la cotisation CNPS à payer par l'employeur
   */
  static calculateCNPSEmployer(grossSalary: number, risque: 'faible' | 'moyen' | 'eleve' = 'moyen'): number {
    const plafond = this.CHARGES_SOCIALES.plafondCNPS;
    const tauxPV = this.CHARGES_SOCIALES.pensionVieillesseEmployeur;
    const tauxPF = this.CHARGES_SOCIALES.prestationsFamiliales.general;
    
    let tauxAT = 0;
    switch (risque) {
      case 'faible':
        tauxAT = this.CHARGES_SOCIALES.accidentsTravail.risqueFaible;
        break;
      case 'moyen':
        tauxAT = this.CHARGES_SOCIALES.accidentsTravail.risqueMoyen;
        break;
      case 'eleve':
        tauxAT = this.CHARGES_SOCIALES.accidentsTravail.risqueEleve;
        break;
    }
    
    const baseCotisation = Math.min(grossSalary, plafond);
    const cotisationPV = (baseCotisation * tauxPV) / 100;
    const cotisationPF = (baseCotisation * tauxPF) / 100;
    const cotisationAT = (baseCotisation * tauxAT) / 100;
    const cotisationFNE = (grossSalary * this.CHARGES_SOCIALES.fne) / 100;
    
    return Math.round(cotisationPV + cotisationPF + cotisationAT + cotisationFNE);
  }

  /**
   * Calcule la contribution au CFC à payer par l'employé
   */
  static calculateCFCEmployee(grossSalary: number): number {
    return Math.round((grossSalary * this.CHARGES_SOCIALES.cfcEmploye) / 100);
  }

  /**
   * Calcule la contribution au CFC à payer par l'employeur
   */
  static calculateCFCEmployer(grossSalary: number): number {
    return Math.round((grossSalary * this.CHARGES_SOCIALES.cfcEmployeur) / 100);
  }

  /**
   * Calcule la contribution au FNE à payer par l'employeur
   */
  static calculateFNE(grossSalary: number): number {
    return Math.round((grossSalary * this.CHARGES_SOCIALES.fne) / 100);
  }

  /**
   * Calcule l'IRPP (Impôt sur le Revenu des Personnes Physiques)
   */
  static calculateIRPP(grossSalary: number): number {
    // Calcul du revenu imposable
    const abattement = Math.min(grossSalary * this.CHARGES_FISCALES.abattementForfaitaire / 100, 
                              this.CHARGES_FISCALES.abattementAnnuel / 12);
    const revenuImposable = grossSalary - abattement;
    
    // Pas d'IRPP si en dessous du seuil
    if (revenuImposable < this.CHARGES_FISCALES.seuilImposition) {
      return 0;
    }
    
    // Calcul de l'IRPP annuel puis mensuel
    const revenuAnnuel = revenuImposable * 12;
    let irppAnnuel = 0;
    
    for (const tranche of this.CHARGES_FISCALES.tranches) {
      if (revenuAnnuel > tranche.min) {
        const revenuDansLaTranche = Math.min(revenuAnnuel, tranche.max) - tranche.min;
        irppAnnuel += (revenuDansLaTranche * tranche.taux) / 100;
      }
    }
    
    // Conversion en mensuel
    return Math.round(irppAnnuel / 12);
  }

  /**
   * Calcule les Centimes Additionnels Communaux (CAC)
   */
  static calculateCAC(irpp: number): number {
    return Math.round((irpp * this.CHARGES_FISCALES.tauxCAC) / 100);
  }

  /**
   * Calcule la Taxe de Développement Local (TDL)
   */
  static calculateTDL(grossSalary: number): number {
    for (const tranche of this.CHARGES_FISCALES.baremesTDL) {
      if (grossSalary > tranche.min && grossSalary <= tranche.max) {
        return tranche.montant;
      }
    }
    return 0;
  }

  /**
   * Calcule la Redevance Audiovisuelle (RAV)
   */
  static calculateRAV(grossSalary: number): number {
    for (const tranche of this.CHARGES_FISCALES.baremesRAV) {
      if (grossSalary > tranche.min && grossSalary <= tranche.max) {
        return tranche.montant;
      }
    }
    return 0;
  }

  /**
   * Calcule le salaire net à partir du salaire brut
   */
  static calculateNetSalary(grossSalary: number): number {
    const cnpsEmployee = this.calculateCNPSEmployee(grossSalary);
    const irpp = this.calculateIRPP(grossSalary);
    const cac = this.calculateCAC(irpp);
    const tdl = this.calculateTDL(grossSalary);
    const rav = this.calculateRAV(grossSalary);
    const cfc = this.calculateCFCEmployee(grossSalary);
    
    const totalCharges = cnpsEmployee + irpp + cac + tdl + rav + cfc;
    return grossSalary - totalCharges;
  }

  /**
   * Calcule les charges patronales totales
   */
  static calculateEmployerCharges(grossSalary: number, risque: 'faible' | 'moyen' | 'eleve' = 'moyen'): {
    cnps: number;
    fne: number;
    cfc: number;
    total: number;
  } {
    const cnps = this.calculateCNPSEmployer(grossSalary, risque);
    const fne = this.calculateFNE(grossSalary);
    const cfc = this.calculateCFCEmployer(grossSalary);
    
    return {
      cnps,
      fne,
      cfc,
      total: cnps + fne + cfc
    };
  }
}
