import express from 'express';
import cors from 'cors';
import { BeamCalculator } from './modules/beamCalculator.mjs';

// Configuração da aplicação
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas de API
app.post("/api/beam/analyze", (req, res) => {
    try {
        const { 
            beamLength, 
            loads, 
            supports, 
            elasticModulus = 210e9, // Padrão para aço em Pa
            momentOfInertia = 1e-6,  // Valor padrão em m^4
            numPoints = 100          // Pontos para discretização
        } = req.body;
        
        // Validação de dados
        if (!beamLength || !loads || !supports) {
            return res.status(400).json({ 
                error: "Dados incompletos. Forneça comprimento da viga, cargas e apoios." 
            });
        }
        
        if (beamLength <= 0) {
            return res.status(400).json({ 
                error: "O comprimento da viga deve ser maior que zero." 
            });
        }
        
        if (loads.length === 0) {
            return res.status(400).json({ 
                error: "Pelo menos uma carga deve ser definida." 
            });
        }
        
        if (supports.length < 2) {
            return res.status(400).json({ 
                error: "Pelo menos dois apoios devem ser definidos." 
            });
        }
        
        // Criação do objeto calculador
        const calculator = new BeamCalculator({
            beamLength,
            loads,
            supports,
            elasticModulus,
            momentOfInertia,
            numPoints
        });
        
        // Execução dos cálculos
        const results = calculator.calculateBeam();
        
        // Resposta ao cliente
        res.json(results);
    } catch (error) {
        console.error('Erro no cálculo da viga:', error);
        res.status(500).json({ 
            error: "Erro ao processar o cálculo da viga", 
            details: error.message 
        });
    }
});

// Endpoint para configurações do material
app.get("/api/materials", (req, res) => {
    // Dados de materiais comuns
    const materials = [
        { 
            id: "steel", 
            name: "Aço Estrutural", 
            elasticModulus: 210e9,
            density: 7850,
            yieldStrength: 250e6
        },
        { 
            id: "aluminum", 
            name: "Alumínio 6061-T6", 
            elasticModulus: 69e9,
            density: 2700,
            yieldStrength: 240e6
        },
        { 
            id: "concrete", 
            name: "Concreto (25 MPa)", 
            elasticModulus: 30e9,
            density: 2400,
            yieldStrength: 25e6
        },
        { 
            id: "wood", 
            name: "Madeira (Carvalho)", 
            elasticModulus: 11e9,
            density: 720,
            yieldStrength: 40e6
        },
        { 
            id: "titanium", 
            name: "Titânio Ti6Al4V", 
            elasticModulus: 110e9,
            density: 4430,
            yieldStrength: 880e6
        }
    ];
    
    res.json(materials);
});

// Endpoint para perfis estruturais
app.get("/api/sections", (req, res) => {
    const sections = [
        { 
            id: "rectangular_100x50", 
            name: "Retangular 100x50mm", 
            type: "rectangle",
            width: 0.1, 
            height: 0.05,
            momentOfInertia: 4.17e-6
        },
        { 
            id: "circular_100", 
            name: "Circular Ø100mm", 
            type: "circle",
            diameter: 0.1, 
            momentOfInertia: 4.91e-6
        },
        { 
            id: "i_beam_200", 
            name: "Perfil I 200mm", 
            type: "i_beam",
            width: 0.1, 
            height: 0.2,
            webThickness: 0.008,
            flangeThickness: 0.012,
            momentOfInertia: 2.14e-5
        }
    ];
    
    res.json(sections);
});

// Endpoint para geração de relatório (mockup)
app.post("/api/report/generate", (req, res) => {
    // Lógica simplificada de geração de relatório
    try {
        // Simulação de processamento
        setTimeout(() => {
            res.json({ 
                message: "Relatório gerado com sucesso", 
                status: "success" 
            });
        }, 1000);
    } catch (error) {
        res.status(500).json({ 
            error: "Erro ao gerar relatório", 
            details: error.message 
        });
    }
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;