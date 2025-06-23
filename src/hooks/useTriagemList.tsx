
import { useState, useEffect } from 'react';
import { useTriagem, Triagem } from './useTriagem';

export const useTriagemList = () => {
  const [pacientesAguardando, setPacientesAguardando] = useState<Triagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getTriagens } = useTriagem();

  const loadTriagens = async () => {
    console.log('🔄 Carregando triagens...');
    setLoading(true);
    setError(null);
    
    try {
      const triagens = await getTriagens();
      console.log('✅ Triagens carregadas:', triagens);
      
      if (!triagens || !Array.isArray(triagens)) {
        console.log('⚠️ Nenhuma triagem encontrada ou dados inválidos');
        setPacientesAguardando([]);
        return;
      }
      
      // Ordenar por prioridade da classificação Manchester
      const ordemPrioridade = {
        'vermelho': 1,
        'laranja': 2,
        'amarelo': 3,
        'verde': 4,
        'azul': 5
      };
      
      const triagensSorted = triagens.sort((a, b) => {
        const prioridadeA = ordemPrioridade[a.classificacao_manchester] || 999;
        const prioridadeB = ordemPrioridade[b.classificacao_manchester] || 999;
        return prioridadeA - prioridadeB;
      });
      
      setPacientesAguardando(triagensSorted);
    } catch (error) {
      console.error('❌ Erro ao carregar triagens:', error);
      setError('Erro ao carregar lista de pacientes');
      setPacientesAguardando([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      if (mounted) {
        await loadTriagens();
      }
    };
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, []); // Remover qualquer dependência para evitar loops

  const refreshTriagens = async () => {
    await loadTriagens();
  };

  return {
    pacientesAguardando,
    loading,
    error,
    refreshTriagens
  };
};
