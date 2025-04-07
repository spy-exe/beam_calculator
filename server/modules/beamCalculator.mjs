// Classe para cálculo de reações de apoio e diagramas de esforços internos em vigas
export class BeamCalculator {
    /**
     * Construtor da classe BeamCalculator
     * @param {Object} options - Opções de configuração
     * @param {number} options.beamLength - Comprimento da viga em metros
     * @param {Array} options.loads - Array de cargas aplicadas
     * @param {Array} options.supports - Array de apoios
     * @param {number} options.elasticModulus - Módulo de elasticidade do material (E) em Pa
     * @param {number} options.momentOfInertia - Momento de inércia da seção (I) em m^4
     * @param {number} options.numPoints - Número de pontos para discretização
     */
    constructor(options) {
        this.beamLength = options.beamLength;
        this.loads = options.loads;
        this.supports = options.supports;
        this.elasticModulus = options.elasticModulus || 210e9; // Padrão: aço
        this.momentOfInertia = options.momentOfInertia || 1e-6; // Valor padrão
        this.numPoints = options.numPoints || 100;
        this.EI = this.elasticModulus * this.momentOfInertia;
        
        // Verificar se os dados são válidos
        this.validateInputs();
    }
    
    /**
     * Validação dos dados de entrada
     */
    validateInputs() {
        if (this.beamLength <= 0) {
            throw new Error("O comprimento da viga deve ser maior que zero");
        }
        
        if (!this.loads || this.loads.length === 0) {
            throw new Error("Pelo menos uma carga deve ser definida");
        }
        
        if (!this.supports || this.supports.length < 2) {
            throw new Error("Pelo menos dois apoios devem ser definidos");
        }
        
        // Validar posições dos apoios
        for (const support of this.supports) {
            if (support.position < 0 || support.position > this.beamLength) {
                throw new Error("A posição dos apoios deve estar dentro do comprimento da viga");
            }
        }
        
        // Validar cargas
        for (const load of this.loads) {
            if (load.type === 'point') {
                if (load.position < 0 || load.position > this.beamLength) {
                    throw new Error("A posição das cargas deve estar dentro do comprimento da viga");
                }
            } else if (load.type === 'distributed') {
                if (load.position < 0 || 
                    load.position > this.beamLength || 
                    load.position + load.length > this.beamLength) {
                    throw new Error("A carga distribuída deve estar dentro do comprimento da viga");
                }
                
                if (load.length <= 0) {
                    throw new Error("O comprimento da carga distribuída deve ser maior que zero");
                }
            } else if (load.type === 'moment') {
                if (load.position < 0 || load.position > this.beamLength) {
                    throw new Error("A posição do momento deve estar dentro do comprimento da viga");
                }
            } else {
                throw new Error(`Tipo de carga inválido: ${load.type}`);
            }
        }
    }
    
    /**
     * Resolve o sistema de equações para encontrar as reações nos apoios
     * @return {Object} Objeto com as reações nos apoios
     */
    solveReactions() {
        // Para uma solução simplificada, assumimos viga simplesmente apoiada com dois suportes
        if (this.supports.length === 2 && 
            this.supports[0].type === 'simple' && 
            this.supports[1].type === 'simple') {
            
            const L = this.beamLength;
            const a = this.supports[0].position;
            const b = this.supports[1].position;
            
            // Inicializar reações
            let Ra = 0;
            let Rb = 0;
            
            // Calcular contribuição de cada carga
            for (const load of this.loads) {
                if (load.type === 'point') {
                    const x = load.position;
                    const P = load.value;
                    
                    // Momento estático: R2 = P * a / L
                    Rb += P * (x - a) / L;
                    Ra += P - Rb;
                } 
                else if (load.type === 'distributed') {
                    const startPos = Math.max(load.position, a);
                    const endPos = Math.min(load.position + load.length, b);
                    
                    if (startPos < endPos) {
                        // Total da carga distribuída
                        const loadLength = endPos - startPos;
                        const totalLoad = load.value * loadLength;
                        const loadCenter = startPos + loadLength / 2;
                        
                        // Momento estático para carga distribuída
                        Rb += totalLoad * (loadCenter - a) / L;
                        Ra += totalLoad - Rb;
                    }
                }
                else if (load.type === 'moment') {
                    const x = load.position;
                    const M = load.value;
                    
                    // Momento distribuído proporcionalmente
                    Rb += M * (x - a) / L;
                    Ra -= M * (b - x) / L;
                }
            }
            
            return {
                reactions: [
                    { position: a, value: Ra, type: 'simple' },
                    { position: b, value: Rb, type: 'simple' }
                ],
                sumForces: Ra + Rb
            };
        }
        
        // Para sistemas mais complexos, seria necessário um método mais sofisticado
        throw new Error("Suportes complexos não implementados nesta versão");
    }
    
    /**
     * Calcula o diagrama de esforço cortante
     * @param {Array} reactions - Reações nos apoios
     * @return {Array} Dados do diagrama de esforço cortante
     */
    calculateShearForce(reactions) {
        const dx = this.beamLength / this.numPoints;
        const shearForce = new Array(this.numPoints + 1).fill(0);
        
        // Contribuição das reações
        for (const reaction of reactions) {
            shearForce.fill(reaction.value, 
                Math.round(reaction.position / dx), 
                this.numPoints + 1
            );
        }
        
        // Subtrair contribuição das cargas
        for (const load of this.loads) {
            for (let i = 0; i <= this.numPoints; i++) {
                const x = i * dx;
                
                if (load.type === 'point' && x >= load.position) {
                    shearForce[i] -= load.value;
                } 
                else if (load.type === 'distributed') {
                    const startPos = load.position;
                    const endPos = load.position + load.length;
                    
                    if (x >= startPos && x <= endPos) {
                        const loadContribution = load.value * dx;
                        shearForce[i] -= loadContribution;
                    }
                }
            }
        }
        
        return shearForce.map((value, index) => ({
            x: index * dx,
            value: value
        }));
    }
    
    /**
     * Calcula o diagrama de momento fletor
     * @param {Array} shearForceData - Dados do diagrama de esforço cortante
     * @return {Array} Dados do diagrama de momento fletor
     */
    calculateBendingMoment(shearForceData) {
        const dx = this.beamLength / this.numPoints;
        const bendingMoment = new Array(this.numPoints + 1).fill(0);
        
        // Integrar o esforço cortante
        for (let i = 1; i <= this.numPoints; i++) {
            bendingMoment[i] = bendingMoment[i-1] + shearForceData[i-1].value * dx;
        }
        
        // Adicionar momentos concentrados
        for (const load of this.loads) {
            if (load.type === 'moment') {
                const momentIndex = Math.round(load.position / dx);
                bendingMoment[momentIndex] += load.value;
            }
        }
        
        return bendingMoment.map((value, index) => ({
            x: index * dx,
            value: value
        }));
    }
    
    /**
     * Calcula o diagrama de deflexão
     * @param {Array} bendingMomentData - Dados do diagrama de momento fletor
     * @return {Array} Dados do diagrama de deflexão
     */
    calculateDeflection(bendingMomentData) {
        const dx = this.beamLength / this.numPoints;
        const numPoints = this.numPoints + 1;
        
        // Integração dupla do momento fletor
        const slope = new Array(numPoints).fill(0);
        const deflection = new Array(numPoints).fill(0);
        
        // Primeira integração: inclinação
        for (let i = 1; i < numPoints; i++) {
            slope[i] = slope[i-1] + (bendingMomentData[i-1].value / this.EI) * dx;
        }
        
        // Segunda integração: deflexão
        for (let i = 1; i < numPoints; i++) {
            deflection[i] = deflection[i-1] + slope[i-1] * dx;
        }
        
        // Correção para apoios
        const supportPositions = this.supports.map(s => 
            Math.round(s.position / dx)
        );
        
        // Ajustar deflexão para zero nos apoios
        supportPositions.forEach(pos => {
            deflection[pos] = 0;
        });
        
        return deflection.map((value, index) => ({
            x: index * dx,
            value: value
        }));
    }
    
    /**
     * Realiza todos os cálculos necessários para a viga
     * @return {Object} Objeto com todos os resultados
     */
    calculateBeam() {
        // Calcular reações nos apoios
        const { reactions, sumForces } = this.solveReactions();
        
        // Calcular diagramas
        const shearForceData = this.calculateShearForce(reactions);
        const bendingMomentData = this.calculateBendingMoment(shearForceData);
        const deflectionData = this.calculateDeflection(bendingMomentData);
        
        // Encontrar valores máximos
        const maxShear = Math.max(...shearForceData.map(d => Math.abs(d.value)));
        const maxMoment = Math.max(...bendingMomentData.map(d => Math.abs(d.value)));
        const maxDeflection = Math.max(...deflectionData.map(d => Math.abs(d.value)));
        
        // Resumo das cargas
        const loadSummary = {
            totalPointLoads: this.loads
                .filter(l => l.type === 'point')
                .reduce((sum, l) => sum + l.value, 0),
            totalDistributedLoad: this.loads
                .filter(l => l.type === 'distributed')
                .reduce((sum, l) => sum + l.value * l.length, 0),
            totalMoment: this.loads
                .filter(l => l.type === 'moment')
                .reduce((sum, l) => sum + l.value, 0)
        };
        
        return {
            input: {
                beamLength: this.beamLength,
                elasticModulus: this.elasticModulus,
                momentOfInertia: this.momentOfInertia
            },
            results: {
                reactions,
                shearForce: shearForceData,
                bendingMoment: bendingMomentData,
                deflection: deflectionData,
                maxValues: {
                    shear: maxShear,
                    moment: maxMoment,
                    deflection: maxDeflection
                },
                loadSummary
            }
        };
    }
}

// Função auxiliar para cálculo de propriedades de seções transversais
export function calculateSectionProperties(section) {
    switch (section.type) {
        case 'rectangle':
            return {
                area: section.width * section.height,
                momentOfInertia: (section.width * Math.pow(section.height, 3)) / 12,
                sectionModulus: (section.width * Math.pow(section.height, 2)) / 6
            };
        
        case 'circle':
            const radius = section.diameter / 2;
            return {
                area: Math.PI * Math.pow(radius, 2),
                momentOfInertia: (Math.PI * Math.pow(radius, 4)) / 4,
                sectionModulus: (Math.PI * Math.pow(radius, 3)) / 4
            };
        
        case 'i_beam':
            const { height, width, webThickness, flangeThickness } = section;
            const flangeArea = width * flangeThickness;
            const webArea = webThickness * (height - 2 * flangeThickness);
            
            return {
                area: 2 * flangeArea + webArea,
                momentOfInertia: calculateIBeamMomentOfInertia(section),
                sectionModulus: calculateIBeamSectionModulus(section)
            };
        
        default:
            throw new Error(`Tipo de seção não suportado: ${section.type}`);
    }
}

// Funções auxiliares para cálculo de propriedades de perfis I
function calculateIBeamMomentOfInertia(section) {
    const { height, width, webThickness, flangeThickness } = section;
    
    // Momento de inércia das mesas
    const I_flange = 2 * (
        (width * Math.pow(flangeThickness, 3)) / 12 + 
        width * flangeThickness * Math.pow(height/2 - flangeThickness/2, 2)
    );
    
    // Momento de inércia da alma
    const I_web = (webThickness * Math.pow(height - 2 * flangeThickness, 3)) / 12;
    
    return I_flange + I_web;
}

function calculateIBeamSectionModulus(section) {
    const { height } = section;
    const momentOfInertia = calculateIBeamMomentOfInertia(section);
    
    return momentOfInertia / (height / 2);
}

export default BeamCalculator;