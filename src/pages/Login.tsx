import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cleanupAuthState } from '@/utils/authCleanup';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const testUsers = [
    { 
      email: 'admin.basico@teste.com', 
      password: '123456',
      plan: 'Básico',
      redirect: '/dashboard-basico'
    },
    { 
      email: 'admin.profissional@teste.com', 
      password: '123456',
      plan: 'Profissional',
      redirect: '/dashboard-profissional'
    },
    { 
      email: 'admin.enterprise@teste.com', 
      password: '123456',
      plan: 'Enterprise',
      redirect: '/dashboard-enterprise'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(`Tentativa de login para: ${formData.email}`);
      
      // Limpar estado de autenticação primeiro
      cleanupAuthState();
      
      // Forçar logout global
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log('Logout global realizado');
      } catch (err) {
        console.log('Erro no logout global (continuando):', err);
      }

      // Aguardar limpeza completa
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar se é usuário teste e criar/confirmar se necessário
      const isTestUser = testUsers.find(user => 
        user.email === formData.email && user.password === formData.password
      );
      
      if (isTestUser) {
        console.log('Usuário teste detectado, garantindo que existe...');
        
        // Tentar criar o usuário (falhará se já existir)
        try {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              emailRedirectTo: `${window.location.origin}${isTestUser.redirect}`
            }
          });
          
          console.log('Resultado do signup:', { signUpData, signUpError });
          
          // Tentar confirmar via edge function
          try {
            const { data: confirmData, error: confirmError } = await supabase.functions.invoke('confirm-test-users', {
              body: { email: formData.email }
            });
            console.log('Resultado da confirmação:', { confirmData, confirmError });
          } catch (confirmErr) {
            console.log('Erro na função de confirmação (continuando):', confirmErr);
          }
          
          // Aguardar processamento
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (createError) {
          console.log('Erro ao criar usuário teste (pode já existir):', createError);
        }
      }

      console.log('Tentando fazer login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      console.log('Resultado do login:', { data, error });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        console.log('Login bem-sucedido para usuário:', data.user.email);
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        
        // Redirecionar para o dashboard específico do plano
        const redirectPath = isTestUser ? isTestUser.redirect : '/dashboard';
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 1000);
      } else {
        throw new Error('Dados de login inválidos');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      let errorMessage = "Verifique suas credenciais e tente novamente";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Email ou senha incorretos";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fillTestUser = (user: typeof testUsers[0]) => {
    setFormData({
      email: user.email,
      password: user.password
    });
  };

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

  return (
    <div className="min-h-screen bg-white">
      {/* Header matching sales page */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-800 to-green-600 rounded-xl flex items-center justify-center">
              <Zap className="text-white h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SALUS</h1>
              <p className="text-sm text-gray-600 font-medium">Healthcare Platform</p>
            </div>
          </Link>
          <Link to="/subscription">
            <Button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-bold">
              Teste Grátis
            </Button>
          </Link>
        </div>
      </header>

      {/* Login content */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-600">
              Entre na sua conta para continuar
            </p>
          </div>

          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="space-y-6 p-8">
              {/* Test users */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800 mb-3">Usuários de teste disponíveis:</p>
                <div className="space-y-2">
                  {testUsers.map((user, index) => (
                    <button
                      key={index}
                      onClick={() => fillTestUser(user)}
                      className="w-full text-left p-3 rounded bg-white hover:bg-blue-50 border border-blue-100 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-900">{user.plan}</span>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                        <span className="text-xs text-blue-600">Clique para preencher</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-11 border-gray-300 focus:border-blue-800 focus:ring-blue-800"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-800 focus:ring-blue-800"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-lg"
                  disabled={loading || !isFormValid}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <div className="text-center space-y-4">
                <Link to="/forgot-password" className="text-blue-800 hover:text-blue-900 text-sm">
                  Esqueci minha senha
                </Link>
                
                <div className="border-t pt-4">
                  <p className="text-gray-600 mb-3 text-sm">
                    Ainda não é assinante?
                  </p>
                  <Link to="/subscription">
                    <Button variant="outline" className="w-full h-11 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white font-medium rounded-lg">
                      Assinar SALUS
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              © 2024 SALUS Healthcare Platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
