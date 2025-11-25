import { useState } from 'react'
import { signIn, signUp } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, User, ArrowRight, Loader2, LogIn } from 'lucide-react'

export function LoginPage() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const navigate = useNavigate()

    // Login form state
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    // Signup form state
    const [signupEmail, setSignupEmail] = useState('')
    const [signupPassword, setSignupPassword] = useState('')
    const [signupName, setSignupName] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            await signIn(loginEmail, loginPassword)

            toast({
                title: 'Bem-vindo de volta!',
                description: 'Login realizado com sucesso',
                className: "bg-green-50 border-green-200 text-green-900",
            })

            navigate('/')
        } catch (error: any) {
            console.error('Login error:', error)
            toast({
                title: 'Erro no login',
                description: error.message || 'Verifique suas credenciais',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            await signUp(signupEmail, signupPassword, signupName)

            toast({
                title: 'Conta criada com sucesso!',
                description: 'Verifique seu email para confirmar a conta',
                className: "bg-blue-50 border-blue-200 text-blue-900",
            })

            // Limpar formulário
            setSignupEmail('')
            setSignupPassword('')
            setSignupName('')
        } catch (error: any) {
            console.error('Signup error:', error)
            toast({
                title: 'Erro no registro',
                description: error.message || 'Não foi possível criar a conta',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px] animate-pulse" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] animate-pulse delay-1000" />
            </div>

            <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative z-10">
                <CardHeader className="space-y-2 text-center pb-8">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-2 ring-1 ring-white/10">
                        <LogIn className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-white">
                        Planilha App Maker
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Gerencie suas operações com eficiência
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-900/50 p-1 border border-white/5">
                            <TabsTrigger
                                value="login"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                            >
                                Login
                            </TabsTrigger>
                            <TabsTrigger
                                value="signup"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                            >
                                Registrar
                            </TabsTrigger>
                        </TabsList>

                        {/* Login Tab */}
                        <TabsContent value="login" className="space-y-4 mt-0">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email" className="text-slate-300">Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                            className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="login-password" className="text-slate-300">Senha</Label>
                                        <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                                            Esqueceu a senha?
                                        </a>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                                        <Input
                                            id="login-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required
                                            disabled={loading}
                                            className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <span className="flex items-center">
                                            Entrar na Plataforma <ArrowRight className="ml-2 h-4 w-4" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Signup Tab */}
                        <TabsContent value="signup" className="space-y-4 mt-0">
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name" className="text-slate-300">Nome Completo</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                                        <Input
                                            id="signup-name"
                                            type="text"
                                            placeholder="João Silva"
                                            value={signupName}
                                            onChange={(e) => setSignupName(e.target.value)}
                                            required
                                            disabled={loading}
                                            className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email" className="text-slate-300">Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                            className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password" className="text-slate-300">Senha</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                            required
                                            disabled={loading}
                                            minLength={6}
                                            className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Mínimo de 6 caracteres
                                    </p>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <span className="flex items-center">
                                            Criar Conta Grátis <ArrowRight className="ml-2 h-4 w-4" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-white/5 py-6">
                    <p className="text-xs text-slate-500 text-center">
                        Ao continuar, você concorda com nossos <br />
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">Termos de Serviço</a> e <a href="#" className="text-slate-400 hover:text-white transition-colors">Política de Privacidade</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
