/* ==========================================================================
   LUME — INTERACTIVE SaaS APPLICATION ENGINE
   Steve Jobs' Philosophy: Uncompromising Craftsmanship & Intuitive Detail
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================
const state = {
    currentTab: 'dashboard',
    activeChatId: 'chat_1',
    aiActive: true,
    radarSearchResult: null,
    hunterSearchLoading: false,
    
    // Core Databases
    chats: [
        {
            id: 'chat_1',
            name: 'Carlos Albuquerque',
            channel: 'olx',
            lastTime: '15:42',
            avatarText: 'CA',
            vehicle: 'VW Jetta 1.4 TSI 2018',
            aiStatus: 'human', // human / ai
            lastMessage: 'Aceita meu Gol 2018 como parte de pagamento?',
            messages: [
                { sender: 'received', text: 'Olá! O Jetta ainda está disponível para visita?', time: '15:39' },
                { sender: 'sent', text: 'Olá, Carlos! Sim, o VW Jetta 1.4 TSI 2018 está disponível. Ele se encontra em nossa sede em São Paulo. Deseja agendar um horário?', time: '15:40', isAI: true },
                { sender: 'received', text: 'Legal, as revisões estão todas em dia? Tem algum retoque de pintura?', time: '15:41' },
                { sender: 'sent', text: 'Sim, Carlos! Todas as revisões foram realizadas em concessionária autorizada e constam no manual físico. O veículo possui laudo cautelar 100% aprovado, sem sinistros ou retoques de pintura. Pintura original de fábrica.', time: '15:41', isAI: true },
                { sender: 'received', text: 'Aceita meu Gol 2018 como parte de pagamento?', time: '15:42' }
            ]
        },
        {
            id: 'chat_2',
            name: 'Mariana Costa Reis',
            channel: 'whatsapp',
            lastTime: '15:20',
            avatarText: 'MC',
            vehicle: 'Honda Civic EXL 2019',
            aiStatus: 'ai',
            lastMessage: 'Qual a quilometragem atual dele?',
            messages: [
                { sender: 'received', text: 'Olá, gostaria de mais informações do Civic anunciado no Instagram.', time: '15:18' },
                { sender: 'sent', text: 'Olá, Mariana! Com certeza. O Honda Civic EXL 2019 está impecável, na cor Cinza Barium, câmbio CVT e bancos em couro.', time: '15:19', isAI: true },
                { sender: 'received', text: 'Qual a quilometragem atual dele?', time: '15:20' }
            ]
        },
        {
            id: 'chat_3',
            name: 'Roberto Diniz',
            channel: 'instagram',
            lastTime: 'Ontem',
            avatarText: 'RD',
            vehicle: 'Jeep Compass Diesel 2018',
            aiStatus: 'ai',
            lastMessage: 'O valor anunciado é negociável?',
            messages: [
                { sender: 'received', text: 'Oi, vi o anúncio do Compass. Lindo carro!', time: 'Ontem' },
                { sender: 'sent', text: 'Olá, Roberto! Muito obrigado. O Compass Longitude Diesel realmente é espetacular. Tração 4x4 e motor turbo-diesel super robusto.', time: 'Ontem', isAI: true },
                { sender: 'received', text: 'O valor anunciado é negociável?', time: 'Ontem' }
            ]
        }
    ],
    
    // Hunter Ads Database
    hunterAds: [
        {
            id: 'ad_1',
            title: 'Ford Focus 2.0 Titanium DSG',
            version: 'DirectFlex 5p Automatic',
            price: 74900,
            km: 68000,
            year: 2016,
            location: 'São Paulo - SP',
            source: 'olx',
            analysis: '⚠️ Caixa PowerShift: Atenção redobrada',
            url: 'https://olx.com.br/anuncio-exemplo-focus'
        },
        {
            id: 'ad_2',
            title: 'Honda Civic 2.0 Sport CVT',
            version: 'i-VTEC FlexOne 4p',
            price: 92800,
            km: 74000,
            year: 2018,
            location: 'Campinas - SP',
            source: 'webmotors',
            analysis: '💎 Ótimo Custo-benefício & Alta liquidez',
            url: 'https://webmotors.com.br/anuncio-exemplo-civic'
        },
        {
            id: 'ad_3',
            title: 'Jeep Compass 2.0 Longitude',
            version: '4x4 TD350 Diesel Aut.',
            price: 119900,
            km: 89000,
            year: 2018,
            location: 'Santo André - SP',
            source: 'olx',
            analysis: '🔍 Checar trocador de calor e coxins',
            url: 'https://olx.com.br/anuncio-exemplo-compass'
        },
        {
            id: 'ad_4',
            title: 'Toyota Corolla 2.0 XEi Aut.',
            version: 'Dual VVT-i DOHC Flex',
            price: 88500,
            km: 62000,
            year: 2017,
            location: 'São Bernardo - SP',
            source: 'facebook',
            analysis: '🛡️ Compra segura. Baixa desvalorização',
            url: 'https://facebook.com/marketplace-exemplo-corolla'
        },
        {
            id: 'ad_5',
            title: 'Peugeot 208 1.6 Griffe Aut.',
            version: '16V Flex 5p',
            price: 49900,
            km: 55000,
            year: 2015,
            location: 'Jundiaí - SP',
            source: 'webmotors',
            analysis: '⚠️ Câmbio AL4 de 4 marchas: Verificar histórico',
            url: 'https://webmotors.com.br/anuncio-exemplo-208'
        }
    ],
    
    // Chronic Issues & Sentiment Database
    radarVehicles: {
        'focus': {
            name: 'Ford Focus (Geração 3)',
            details: 'Modelos de 2014 a 2019 com motor 2.0 DirectFlex.',
            riskLevel: 'red',
            riskText: 'Alto Risco Mecânico',
            chronics: [
                {
                    title: 'Câmbio Automatizado PowerShift (DPS6)',
                    desc: 'O problema crônico mais grave. Trepidação severa nas saídas, patinação de embreagens, infiltração de óleo na caixa de embreagem e travamento de atuadores devido a falha de projeto no retentor. Custo de reparo costuma passar de R$ 8.000.'
                },
                {
                    title: 'Módulo da Direção Elétrica',
                    desc: 'Travamento repentino da assistência de direção durante a condução. Luz de alerta no painel acende e o volante fica extremamente pesado. É gerado por infiltração de água e falha eletrônica no chicote.'
                },
                {
                    title: 'Fechaduras das Portas',
                    desc: 'Quebra interna das travas das portas, impedindo o fechamento. Em alguns casos, a porta pode se abrir sozinha com o veículo em movimento. Alvo de recall da Ford.'
                }
            ],
            sentiment: [
                { label: 'Transmissão', score: 18 }, // % Positiva
                { label: 'Motor Duratec 2.0', score: 85 },
                { label: 'Suspensão Traseira', score: 62 },
                { label: 'Acabamento/Ruído', score: 55 },
                { label: 'Liquidez de Revenda', score: 25 }
            ],
            quote: '"O carro é espetacular de guiar, mas o câmbio PowerShift é uma bomba-relógio. O meu quebrou duas vezes com menos de 60.000 km, e a Ford demorou semanas para consertar na garantia." (Opinião do Dono - Portal AutoReparos)',
            checklist: [
                { title: 'Trepidação em Baixa Velocidade', desc: 'Realizar teste dinâmico simulando trânsito pesado de 1ª para 2ª marcha. Trepidação sutil indica embreagem contaminada.' },
                { title: 'Data de troca do TCM / Recall', desc: 'Solicitar histórico da concessionária para verificar se o módulo TCM da transmissão e embreagem já foram trocados pelo recall estendido.' },
                { title: 'Folga na Caixa de Direção', desc: 'Com o carro parado e ligado, movimentar o volante rapidamente para esquerda/direita e ouvir se há estalos metálicos na base.' },
                { title: 'Borrachas de Vedação Traseira', desc: 'Verificar infiltrações de água no carpete do porta-malas, que afeta a central de fusíveis traseira.' }
            ]
        },
        'compass': {
            name: 'Jeep Compass (Diesel)',
            details: 'Modelos de 2017 a 2021 com motor 2.0 MultiJet Turbo-diesel.',
            riskLevel: 'yellow',
            riskText: 'Risco Moderado',
            chronics: [
                {
                    title: 'Trocador de Calor da Transmissão (Câmbio AT9)',
                    desc: 'Falha gravíssima por corrosão galvânica nas galerias de água do trocador de calor. Mistura água de arrefecimento com o fluido da transmissão automática, destruindo totalmente a caixa interna de engrenagens. Reparo custa entre R$ 15.000 e R$ 25.000.'
                },
                {
                    title: 'Desgaste Prematuro de Coxins de Motor',
                    desc: 'Os coxins hidráulicos do motor diesel sofrem fadiga precoce. Causa trepidação excessiva transmitida para a cabine e barulhos metálicos ao passar em lombadas ou ao dar a partida.'
                },
                {
                    title: 'Ruído na Caixa de Direção',
                    desc: 'Estalos no volante ao realizar manobras de estacionamento. Causado por desgaste prematuro na bucha interna da cremalheira da caixa de direção hidráulica/elétrica.'
                }
            ],
            sentiment: [
                { label: 'Câmbio AT9 & Marchas', score: 58 },
                { label: 'Motor MultiJet 2.0', score: 90 },
                { label: 'Isolamento Acústico', score: 82 },
                { label: 'Suspensão 4x4', score: 78 },
                { label: 'Manutenção de Peças', score: 45 }
            ],
            quote: '"Carro extremamente seguro e forte para viagens longas, porém a Jeep deveria ter feito um recall para o trocador de calor. Troquei o meu preventivamente por R$ 1.800 para não perder o câmbio." (Opinião do Dono - Fórum 4x4 Brasil)',
            checklist: [
                { title: 'Reservatório de Expansão de Água', desc: 'Verificar rigorosamente a cor da água no reservatório. Se houver aspecto "café com leite" ou marcas escuras nas laterais, o trocador de calor rompeu.' },
                { title: 'Ruído e Vibração em Marcha Lenta', desc: 'Avaliar se há trepidação severa no painel e volante com o motor ligado na posição D (Drive).' },
                { title: 'Folgas nos Braços de Suspensão', desc: 'Inspecionar buchas da suspensão traseira multilink, propensas a desgaste prematuro em estradas de terra.' }
            ]
        },
        'civic': {
            name: 'Honda Civic (Geração 10)',
            details: 'Modelos de 2017 a 2021 com motor 2.0 FlexOne.',
            riskLevel: 'green',
            riskText: 'Baixo Risco / Altamente Seguro',
            chronics: [
                {
                    title: 'Caixa de Direção (Estalos/Manobras)',
                    desc: 'Alguns proprietários relatam estalos leves na caixa de direção elétrica ao manobrar o carro frio em baixas velocidades. Geralmente resolvido com reaperto ou lubrificação técnica no mancal.'
                },
                {
                    title: 'Vazamento no Condensador do Ar Condicionado',
                    desc: 'Microfuros gerados por pedriscos devido à grade frontal muito aberta, ou corrosão precoce nas aletas de alumínio do condensador, interrompendo o resfriamento de cabine.'
                }
            ],
            sentiment: [
                { label: 'Confiabilidade Mecânica', score: 96 },
                { label: 'Design e Estética', score: 94 },
                { label: 'Consumo de Combustível', score: 72 },
                { label: 'Espaço Interno', score: 88 },
                { label: 'Estabilidade/Direção', score: 95 }
            ],
            quote: '"Tive dois Civics dessa geração. Manutenção é basicamente óleo, filtros e pastilhas. O único problema foi o ar-condicionado que furou o condensador na estrada, mas a Honda trocou cortesia." (Opinião do Dono - Civic Club Brasil)',
            checklist: [
                { title: 'Ruído da Direção Elétrica', desc: 'Fazer manobra completa de batente a batente em asfalto liso e verificar se há qualquer tipo de estalo ou atrito na coluna.' },
                { title: 'Eficiência do Ar Condicionado', desc: 'Ligar o ar condicionado na temperatura mínima e verificar se o compressor desarma com frequência ou demora a esfriar.' },
                { title: 'Desgaste da Banda de Rodagem Traseira', desc: 'Verificar se os pneus traseiros estão com desgaste irregular no lado interno, comum por desalinhamento do eixo traseiro multilink.' }
            ]
        }
    }
};

// ==========================================================================
// SUPABASE CLIENT INTEGRATION & SYNCHRONIZATION
// ==========================================================================
const supabaseUrl = 'https://xeheyokngyuwdpnuthbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlaGV5b2tuZ3l1d2RwbnV0aGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTgxOTksImV4cCI6MjA5NDc5NDE5OX0.8Df2jzL_YoF9QJZm6BeR7pWYXNqlEVJgVOiO3XxbUM4';
let supabase = null;
let isSupabaseActive = false;

try {
    if (window.supabase) {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    }
} catch (e) {
    console.warn("Could not load Supabase script or initialize client:", e);
}

async function checkSupabaseConnection() {
    if (!supabase) return;
    try {
        const { data, error } = await supabase.from('leads').select('id').limit(1);
        if (!error) {
            isSupabaseActive = true;
            console.log("⚡ Supabase conectado com sucesso!");
            
            // Try to load chats
            await loadChatsFromSupabase();
        } else {
            console.warn("⚠️ Supabase: Tabelas não encontradas ou acesso RLS bloqueado. Executando em Modo Sandbox.", error);
        }
    } catch(e) {
        console.warn("⚠️ Falha na integração com Supabase. Executando em Modo Sandbox.", e);
    }
}

async function loadChatsFromSupabase() {
    if (!isSupabaseActive) return;
    try {
        const { data: leads, error: leadsErr } = await supabase.from('leads').select('*').order('last_active_time', { ascending: false });
        if (leadsErr) throw leadsErr;
        
        if (leads && leads.length > 0) {
            const chats = [];
            for (const lead of leads) {
                // Fetch messages for this lead
                const { data: msgs, error: msgsErr } = await supabase.from('messages').select('*').eq('lead_id', lead.id).order('created_at', { ascending: true });
                
                const messages = (msgs || []).map(m => {
                    const date = new Date(m.created_at);
                    const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                    return {
                        sender: m.sender_type === 'customer' ? 'received' : 'sent',
                        text: m.content,
                        time: timeStr,
                        isAI: m.sender_type === 'ai'
                    };
                });
                
                const initials = lead.customer_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                
                chats.push({
                    id: lead.id,
                    name: lead.customer_name,
                    channel: lead.channel,
                    lastTime: new Date(lead.last_active_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatarText: initials || 'LE',
                    vehicle: lead.vehicle_interested,
                    aiStatus: lead.ai_status,
                    lastMessage: lead.last_message,
                    messages: messages
                });
            }
            state.chats = chats;
            if (chats.length > 0) {
                state.activeChatId = chats[0].id;
            }
            // Trigger UI rerender
            setupInboxModule();
            updateDashboardSummary();
        } else {
            // Seed DB with mock data if it is empty!
            await seedMockDataToSupabase();
        }
    } catch (e) {
        console.error("Error loading chats from Supabase:", e);
    }
}

async function seedMockDataToSupabase() {
    if (!isSupabaseActive) return;
    try {
        console.log("Seeding default chats to Supabase...");
        
        // Retrieve profile or first available consultant
        const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
        let consultantId = profiles && profiles.length > 0 ? profiles[0].id : null;
        
        if (!consultantId) {
            console.warn("Nenhum perfil de consultor encontrado em profiles. Cadastre um usuário no banco para habilitar persistência com RLS.");
            return;
        }
        
        for (const chat of state.chats) {
            const { data: newLead, error: leadErr } = await supabase.from('leads').insert({
                consultant_id: consultantId,
                customer_name: chat.name,
                channel: chat.channel,
                vehicle_interested: chat.vehicle,
                ai_status: chat.aiStatus,
                last_message: chat.lastMessage
            }).select().single();
            
            if (leadErr) {
                console.warn("Erro ao inserir lead no Supabase:", leadErr);
                continue;
            }
            
            const msgsToInsert = chat.messages.map(m => ({
                lead_id: newLead.id,
                sender_type: m.sender === 'received' ? 'customer' : (m.isAI ? 'ai' : 'consultant'),
                content: m.text
            }));
            
            await supabase.from('messages').insert(msgsToInsert);
        }
        
        console.log("Banco seeded com dados padrão com sucesso!");
        await loadChatsFromSupabase();
    } catch(e) {
        console.error("Erro no seeding do Supabase:", e);
    }
}

async function saveMessageToSupabase(leadId, senderType, content) {
    if (!isSupabaseActive) return;
    try {
        const { error } = await supabase.from('messages').insert({
            lead_id: leadId,
            sender_type: senderType,
            content: content
        });
        if (error) throw error;
        
        await supabase.from('leads').update({
            last_message: content,
            last_active_time: new Date().toISOString()
        }).eq('id', leadId);
    } catch(e) {
        console.error("Erro ao salvar mensagem no Supabase:", e);
    }
}

async function updateAIStatusInSupabase(leadId, aiStatus) {
    if (!isSupabaseActive) return;
    try {
        await supabase.from('leads').update({
            ai_status: aiStatus
        }).eq('id', leadId);
    } catch(e) {
        console.error("Erro ao atualizar status de IA no Supabase:", e);
    }
}

async function saveInspectionReportToSupabase(vehicleModel, riskLevel, checklistState, notes) {
    if (!isSupabaseActive) return;
    try {
        const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
        const consultantId = profiles && profiles.length > 0 ? profiles[0].id : null;
        
        if (!consultantId) return;
        
        await supabase.from('inspection_reports').insert({
            consultant_id: consultantId,
            vehicle_model: vehicleModel,
            risk_level: riskLevel,
            checklist_state: checklistState,
            notes: notes
        });
        console.log("Dossiê salvo no Supabase!");
    } catch(e) {
        console.error("Erro ao salvar dossiê no Supabase:", e);
    }
}

// ==========================================================================
// APPLICATION INITIALIZATION & NAVIGATION
// ==========================================================================
function initApp() {
    setupNavigation();
    setupInboxModule();
    setupHunterModule();
    setupRadarModule();
    updateDashboardSummary();
    checkSupabaseConnection();
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.view-section');
    const headerTitle = document.querySelector('.header-title h1');
    const headerSub = document.querySelector('.header-title p');
    
    const titles = {
        dashboard: { main: 'Painel Geral', sub: 'Métricas agregadas e status operacional da inteligência Lume' },
        inbox: { main: 'Central Lume', sub: 'Inbox unificada omnichannel com triagem assistida por IA' },
        hunter: { main: 'Caçador Lume', sub: 'Smart Aggregator de anúncios Webmotors, OLX e redes sociais' },
        radar: { main: 'Radar de Crônicos', sub: 'Análise de sentimento de proprietários e histórico de falhas de mercado' }
    };
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            if (!targetTab) return;
            
            state.currentTab = targetTab;
            
            // Toggle active classes on nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            // Toggle active section
            sections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === `${targetTab}-section`) {
                    sec.classList.add('active');
                }
            });
            
            // Update Header text
            headerTitle.textContent = titles[targetTab].main;
            headerSub.textContent = titles[targetTab].sub;
            
            if (targetTab === 'dashboard') {
                updateDashboardSummary();
            }
        });
    });
}

function updateDashboardSummary() {
    // Generate dashboard KPI numbers based on current states
    const activeChatsCount = state.chats.length;
    const pendingAttention = state.chats.filter(c => c.aiStatus === 'human').length;
    
    document.getElementById('kpi-active-leads').textContent = activeChatsCount;
    document.getElementById('kpi-pending-human').textContent = pendingAttention;
    
    // Fill recent activities log dynamically
    const logList = document.getElementById('recent-activity-list');
    if (logList) {
        logList.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding: 0.8rem 0;">
                <div>
                    <p style="font-weight:600; font-size:0.85rem; color:#fff;">Lead Carlos Albuquerque escalado</p>
                    <p style="font-size:0.75rem; color:#71717a;">Proposta de troca acionou filtro humano na Central</p>
                </div>
                <span class="status-pill human">Humano</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding: 0.8rem 0;">
                <div>
                    <p style="font-weight:600; font-size:0.85rem; color:#fff;">Lume AI atendeu Mariana Costa</p>
                    <p style="font-size:0.75rem; color:#71717a;">Perguntas sobre quilometragem respondidas por dados</p>
                </div>
                <span class="status-pill ai">IA</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding: 0.8rem 0 0 0;">
                <div>
                    <p style="font-weight:600; font-size:0.85rem; color:#fff;">Caçador consolidou 5 novos carros</p>
                    <p style="font-size:0.75rem; color:#71717a;">Filtros de busca atualizados para Jetta/Civic/Compass</p>
                </div>
                <span style="font-size:0.75rem; color:var(--accent-solid); font-weight:600;">Caçador</span>
            </div>
        `;
    }
}

// ==========================================================================
// MODULE 1: CENTRAL LUME (OMNICHANNEL INBOX ENGINE)
// ==========================================================================
function setupInboxModule() {
    const threadContainer = document.getElementById('chat-threads-container');
    const msgContainer = document.getElementById('chat-messages-container');
    const sendBtn = document.getElementById('btn-send-message');
    const chatInput = document.getElementById('chat-text-input');
    const aiToggle = document.getElementById('ai-active-toggle');
    
    // Render list of threads
    renderThreads();
    renderActiveChat();
    
    // Toggle AI Button click
    aiToggle.addEventListener('click', () => {
        state.aiActive = !state.aiActive;
        aiToggle.classList.toggle('active', state.aiActive);
        
        // Update status of active chat if AI is toggled off
        const activeChat = state.chats.find(c => c.id === state.activeChatId);
        if (activeChat) {
            if (!state.aiActive && activeChat.aiStatus === 'ai') {
                activeChat.aiStatus = 'human';
                updateAIStatusInSupabase(activeChat.id, 'human');
                renderThreads();
                renderActiveChat();
            } else if (state.aiActive && activeChat.aiStatus === 'human' && activeChat.id !== 'chat_1') {
                activeChat.aiStatus = 'ai';
                updateAIStatusInSupabase(activeChat.id, 'ai');
                renderThreads();
                renderActiveChat();
            }
        }
    });
    
    // Send message handling
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
    
    function renderThreads() {
        threadContainer.innerHTML = '';
        state.chats.forEach(chat => {
            const isActive = chat.id === state.activeChatId;
            const threadItem = document.createElement('div');
            threadItem.className = `chat-thread-item ${isActive ? 'active' : ''}`;
            threadItem.setAttribute('data-id', chat.id);
            
            threadItem.innerHTML = `
                <div class="chat-avatar-wrapper">
                    <div class="chat-avatar">${chat.avatarText}</div>
                    <div class="channel-badge ${chat.channel}">
                        ${getChannelIconSvg(chat.channel)}
                    </div>
                </div>
                <div class="chat-thread-info">
                    <div class="chat-thread-header">
                        <span class="chat-name">${chat.name}</span>
                        <span class="chat-time">${chat.lastTime}</span>
                    </div>
                    <div class="chat-last-message">${chat.lastMessage}</div>
                    <div class="chat-status-indicators">
                        <span class="status-pill ${chat.aiStatus}">${chat.aiStatus === 'ai' ? 'Lume AI Ativo' : 'Atenção Humana'}</span>
                    </div>
                </div>
            `;
            
            threadItem.addEventListener('click', () => {
                state.activeChatId = chat.id;
                renderThreads();
                renderActiveChat();
            });
            
            threadContainer.appendChild(threadItem);
        });
    }
    
    function renderActiveChat() {
        const chat = state.chats.find(c => c.id === state.activeChatId);
        if (!chat) return;
        
        // Header
        document.getElementById('active-chat-name').textContent = chat.name;
        document.getElementById('active-chat-vehicle').textContent = chat.vehicle;
        
        // Render Messages
        msgContainer.innerHTML = '';
        
        chat.messages.forEach(msg => {
            const isSent = msg.sender === 'sent';
            const msgWrapper = document.createElement('div');
            msgWrapper.className = `msg-wrapper ${isSent ? 'sent' : 'received'}`;
            
            msgWrapper.innerHTML = `
                <div class="msg-bubble">${msg.text}</div>
                <div class="msg-meta">
                    ${msg.time}
                    ${msg.isAI ? '<span class="msg-agent-tag">Lume AI</span>' : ''}
                </div>
            `;
            
            msgContainer.appendChild(msgWrapper);
        });
        
        // If escalated to human and the last message is from user (Carlos), show warning
        if (chat.aiStatus === 'human' && chat.id === 'chat_1') {
            const warningBubble = document.createElement('div');
            warningBubble.className = 'system-alert-bubble';
            warningBubble.innerHTML = '⚠️ <strong>Lume AI emitiu alerta:</strong> Cliente propôs troca de veículo ("Gol 2018"). Resposta automática pausada. Assuma a negociação abaixo.';
            msgContainer.appendChild(warningBubble);
        }
        
        // Scroll to bottom
        setTimeout(() => {
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }, 50);
    }
    
    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        const chat = state.chats.find(c => c.id === state.activeChatId);
        if (!chat) return;
        
        // Create new message
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        chat.messages.push({
            sender: 'sent',
            text: text,
            time: timeStr,
            isAI: false
        });
        
        chat.lastMessage = text;
        chat.lastTime = timeStr;
        chatInput.value = '';
        
        renderThreads();
        renderActiveChat();
        
        // Save to Supabase
        saveMessageToSupabase(chat.id, 'consultant', text);
        
        // Simulate potential buyer answer after 2.5 seconds (Simulação Interativa)
        if (chat.id === 'chat_2' || chat.id === 'chat_3') {
            simulateBuyerResponse(chat);
        }
    }
    
    function simulateBuyerResponse(chat) {
        setTimeout(() => {
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            let replyText = 'Ok, vou conversar com minha esposa e te aviso.';
            
            // Simple keyword answering simulator
            const lastMsg = chat.messages[chat.messages.length - 1].text.toLowerCase();
            if (lastMsg.includes('preço') || lastMsg.includes('valor') || lastMsg.includes('desconto')) {
                replyText = 'Vocês aceitam troca? Tenho uma moto Honda CG 160 que posso dar como entrada.';
            } else if (lastMsg.includes('visita') || lastMsg.includes('olhar') || lastMsg.includes('ver')) {
                replyText = 'Pode ser amanhã às 14h? Qual o endereço completo de vocês?';
            }
            
            chat.messages.push({
                sender: 'received',
                text: replyText,
                time: timeStr
            });
            
            chat.lastMessage = replyText;
            chat.lastTime = timeStr;
            
            // Save to Supabase
            saveMessageToSupabase(chat.id, 'customer', replyText);
            
            // Trigger AI auto-response if toggle is active and not escalated
            if (state.aiActive && chat.aiStatus === 'ai') {
                triggerAIAutoResponse(chat, replyText);
            }
            
            renderThreads();
            renderActiveChat();
        }, 2500);
    }
    
    function triggerAIAutoResponse(chat, buyerText) {
        setTimeout(() => {
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            let aiText = '';
            let escalate = false;
            
            // AI rules logic
            if (buyerText.toLowerCase().includes('troca') || buyerText.toLowerCase().includes('moto') || buyerText.toLowerCase().includes('gol')) {
                aiText = 'Como a sua oferta envolve troca de veículo, vou transferir você agora mesmo para o nosso especialista humano. Um instante, ele já vai te responder!';
                escalate = true;
            } else if (buyerText.toLowerCase().includes('endereço') || buyerText.toLowerCase().includes('onde') || buyerText.toLowerCase().includes('visita')) {
                aiText = 'Excelente! Estamos localizados na Av. Europa, 1200 - Jardins, São Paulo/SP. Já deixei pré-agendada a sua visita para amanhã às 14h. Aguardamos você!';
            } else {
                aiText = 'Perfeito! Fico no seu aguardo. Se tiver qualquer outra dúvida sobre o carro, estou aqui para ajudar.';
            }
            
            chat.messages.push({
                sender: 'sent',
                text: aiText,
                time: timeStr,
                isAI: true
            });
            
            chat.lastMessage = aiText;
            chat.lastTime = timeStr;
            
            // Save to Supabase
            saveMessageToSupabase(chat.id, 'ai', aiText);
            
            if (escalate) {
                chat.aiStatus = 'human';
                updateAIStatusInSupabase(chat.id, 'human');
                // Trigger browser chime or sound alert if supported
                playNotificationSound();
            }
            
            renderThreads();
            renderActiveChat();
        }, 1500);
    }
    
    function playNotificationSound() {
        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const osc = context.createOscillator();
            const gain = context.createGain();
            osc.connect(gain);
            gain.connect(context.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, context.currentTime); // A5
            gain.gain.setValueAtTime(0.1, context.currentTime);
            osc.start();
            osc.stop(context.currentTime + 0.15);
        } catch(e) {
            console.log("Audio notification skipped.");
        }
    }
    
    function getChannelIconSvg(channel) {
        if (channel === 'whatsapp') {
            return `<svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.381 9.805-9.768.002-2.607-1.017-5.059-2.87-6.914C16.353 2.067 13.9 1.047 11.29 1.047c-5.4.004-9.802 4.387-9.805 9.778 0 1.57.43 3.102 1.243 4.453L1.7 20.89l4.947-1.736zm11.233-5.263c-.302-.15-1.785-.88-2.062-.98-.276-.1-.478-.15-.678.15-.2.3-.775.98-.95 1.18-.175.2-.35.225-.65.075-.3-.15-1.268-.467-2.416-1.492-.893-.797-1.496-1.782-1.672-2.082-.175-.3-.018-.462.13-.61.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.678-1.635-.93-2.245-.244-.59-.513-.51-.697-.52-.18-.01-.387-.01-.595-.01-.207 0-.547.078-.833.39-.286.313-1.093 1.07-1.093 2.61 0 1.54 1.12 3.03 1.27 3.23.15.2 2.2 3.363 5.33 4.718.745.32 1.325.512 1.78.656.75.24 1.43.205 1.968.125.6-.09 1.785-.73 2.037-1.43.25-.7.25-1.293.175-1.43-.075-.138-.275-.288-.575-.438z"/></svg>`;
        } else if (channel === 'olx') {
            return `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>`;
        } else {
            return `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051c-.06 1.282-.074 1.689-.074 4.949s.015 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;
        }
    }
}

// ==========================================================================
// MODULE 2: CAÇADOR LUME (AGGREGATOR ENGINE)
// ==========================================================================
function setupHunterModule() {
    const searchBtn = document.getElementById('btn-hunter-search');
    const loadingView = document.getElementById('hunter-loading-view');
    const resultsContainer = document.getElementById('hunter-results-container');
    const modelInput = document.getElementById('hunter-model-input');
    const brandSelect = document.getElementById('hunter-brand-select');
    const kmSlider = document.getElementById('hunter-km-slider');
    const kmValue = document.getElementById('hunter-km-value');
    
    // New controls for City and Radius
    const cityInput = document.getElementById('hunter-city-select');
    const radiusSlider = document.getElementById('hunter-radius-slider');
    const radiusValue = document.getElementById('hunter-radius-value');
    
    // Distance calculation logic for realistic simulation
    const distanceMatrix = {
        'sao paulo': { 'são paulo': 0, 'campinas': 90, 'santo andré': 20, 'são bernardo': 22, 'jundiaí': 50 },
        'campinas': { 'são paulo': 90, 'campinas': 0, 'santo andré': 110, 'são bernardo': 112, 'jundiaí': 40 },
        'santo andre': { 'são paulo': 20, 'campinas': 110, 'santo andré': 0, 'são bernardo': 5, 'jundiaí': 70 },
        'sao bernardo': { 'são paulo': 22, 'campinas': 112, 'santo andré': 5, 'são bernardo': 0, 'jundiaí': 72 },
        'jundiai': { 'são paulo': 50, 'campinas': 40, 'santo andré': 70, 'são bernardo': 72, 'jundiaí': 0 }
    };

    function normalizeString(str) {
        if (!str) return '';
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }

    function getDistance(fromCity, toLocation) {
        const fromNorm = normalizeString(fromCity);
        const toCity = toLocation.split('-')[0].trim();
        const toNorm = normalizeString(toCity);
        
        if (fromNorm === toNorm) return 0;
        
        if (distanceMatrix[fromNorm] && distanceMatrix[fromNorm][toNorm] !== undefined) {
            return distanceMatrix[fromNorm][toNorm];
        }
        
        const key = Object.keys(distanceMatrix).find(k => k.includes(fromNorm) || fromNorm.includes(k));
        if (key && distanceMatrix[key][toNorm] !== undefined) {
            return distanceMatrix[key][toNorm];
        }
        
        // Stable pseudo-random distance based on string hash
        let hash = 0;
        const combined = fromNorm + toNorm;
        for (let i = 0; i < combined.length; i++) {
            hash = combined.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 130) + 15; // between 15 and 145 km
    }
    
    // Bind slider output display
    kmSlider.addEventListener('input', (e) => {
        kmValue.textContent = e.target.value === '120' ? 'Sem Limite' : `${e.target.value}.000 km`;
    });
    
    // Bind radius slider output display
    radiusSlider.addEventListener('input', (e) => {
        radiusValue.textContent = e.target.value === '150' ? 'Sem Limite' : `${e.target.value} km`;
    });
    
    // Simulate Hunter crawler Search
    searchBtn.addEventListener('click', () => {
        state.hunterSearchLoading = true;
        
        // UI feedback states
        resultsContainer.style.display = 'none';
        loadingView.style.display = 'flex';
        searchBtn.disabled = true;
        searchBtn.innerHTML = 'Aguarde...';
        
        setTimeout(() => {
            state.hunterSearchLoading = false;
            loadingView.style.display = 'none';
            resultsContainer.style.display = 'flex';
            searchBtn.disabled = false;
            searchBtn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> Buscar Anúncios`;
            
            // Filter Ads
            renderFilteredAds();
        }, 1200);
    });
    
    // Initial load of ads
    renderFilteredAds();
    
    function renderFilteredAds() {
        const query = modelInput.value.trim().toLowerCase();
        const brand = brandSelect.value;
        const maxKm = parseInt(kmSlider.value) * 1000;
        const refCity = cityInput.value.trim();
        const maxRadius = parseInt(radiusSlider.value);
        
        // Filter elements
        let filtered = state.hunterAds;
        
        if (query) {
            filtered = filtered.filter(ad => ad.title.toLowerCase().includes(query) || ad.version.toLowerCase().includes(query));
        }
        
        if (brand !== 'all') {
            filtered = filtered.filter(ad => ad.title.toLowerCase().includes(brand));
        }
        
        if (kmSlider.value !== '120') {
            filtered = filtered.filter(ad => ad.km <= maxKm);
        }
        
        // Filter by Radius from reference City if provided
        if (refCity && radiusSlider.value !== '150') {
            filtered = filtered.filter(ad => {
                const dist = getDistance(refCity, ad.location);
                return dist <= maxRadius;
            });
        }
        
        resultsContainer.innerHTML = '';
        
        if (filtered.length === 0) {
            resultsContainer.innerHTML = `
                <div class="card" style="text-align:center; padding:3rem; color:#71717a;">
                    <svg width="48" height="48" style="stroke:#71717a; margin-bottom:1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                    <p style="font-size:1rem; font-weight:600; color:#fff; margin-bottom:0.3rem;">Nenhum carro encontrado</p>
                    <p style="font-size:0.85rem;">Tente ajustar as faixas de raio, quilometragem ou limpar os filtros de busca.</p>
                </div>
            `;
            return;
        }
        
        filtered.forEach(ad => {
            const adCard = document.createElement('div');
            adCard.className = 'car-result-card';
            
            // Calculate distance for this card's location
            const distanceVal = getDistance(refCity, ad.location);
            const distanceText = refCity ? `(~${distanceVal} km)` : '';
            
            adCard.innerHTML = `
                <div class="car-image-placeholder">
                    <span class="car-source-badge ${ad.source}">${ad.source.toUpperCase()}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3C13 6.8 11.5 6 10 6H4c-1.1 0-2 .9-2 2v8c0 .6.4 1 1 1h2m10 0a3 3 0 1 1-6 0m6 0a3 3 0 1 0-6 0m11 0a3 3 0 1 1-6 0m6 0a3 3 0 1 0-6 0"/>
                    </svg>
                </div>
                <div class="car-details-panel">
                    <div class="car-header">
                        <div class="car-title-wrapper">
                            <h3>${ad.title}</h3>
                            <div class="car-version">${ad.version}</div>
                        </div>
                        <div class="car-price-badge">R$ ${ad.price.toLocaleString('pt-BR')}</div>
                    </div>
                    
                    <div class="car-meta-grid">
                        <div class="car-meta-item">
                            <span class="label">Ano</span>
                            <span class="value">${ad.year}/${ad.year}</span>
                        </div>
                        <div class="car-meta-item">
                            <span class="label">Quilometragem</span>
                            <span class="value">${ad.km.toLocaleString('pt-BR')} km</span>
                        </div>
                        <div class="car-meta-item">
                            <span class="label">Localização</span>
                            <span class="value">${ad.location} <strong style="color:var(--accent-solid); font-weight:600; font-size:0.75rem; margin-left:0.2rem;">${distanceText}</strong></span>
                        </div>
                    </div>
                    
                    <span class="car-analysis-tag">${ad.analysis}</span>
                    
                    <div class="car-actions-wrapper">
                        <a href="${ad.url}" target="_blank" class="btn-secondary" style="padding:0.5rem 1rem; font-size:0.8rem; text-decoration:none;">
                            Ver Original <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-left:0.2rem;"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        </a>
                    </div>
                </div>
            `;
            
            resultsContainer.appendChild(adCard);
        });
    }
}

// ==========================================================================
// MODULE 3: RADAR DE CRÔNICOS ENGINE
// ==========================================================================
function setupRadarModule() {
    const searchBtn = document.getElementById('btn-radar-search');
    const searchInput = document.getElementById('radar-search-input');
    const defaultPlaceholder = document.getElementById('radar-default-placeholder');
    const dashboardView = document.getElementById('radar-dashboard-view');
    const docGenBtn = document.getElementById('btn-generate-doc');
    
    searchBtn.addEventListener('click', performRadarSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performRadarSearch();
    });
    
    // Quick search model tag helpers click
    const quickTags = document.querySelectorAll('.quick-search-tag');
    quickTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const query = tag.getAttribute('data-model');
            searchInput.value = query;
            performRadarSearch();
        });
    });
    
    function performRadarSearch() {
        const query = searchInput.value.trim().toLowerCase();
        let matchedKey = null;
        
        // Find best match in our static database
        if (query.includes('focus') || query.includes('ford')) {
            matchedKey = 'focus';
        } else if (query.includes('compass') || query.includes('jeep') || query.includes('diesel')) {
            matchedKey = 'compass';
        } else if (query.includes('civic') || query.includes('honda')) {
            matchedKey = 'civic';
        }
        
        if (!matchedKey) {
            // Handle not found with a fallback simulated result for demonstration
            showRadarNotFound(searchInput.value);
            return;
        }
        
        const vehicle = state.radarVehicles[matchedKey];
        state.radarSearchResult = vehicle;
        
        // Toggle view panels
        defaultPlaceholder.style.display = 'none';
        dashboardView.style.display = 'grid';
        
        // Render values
        document.getElementById('radar-car-name').textContent = vehicle.name;
        document.getElementById('radar-car-details').textContent = vehicle.details;
        
        // Level badge
        const levelBadge = document.getElementById('radar-risk-badge');
        levelBadge.className = `radar-alert-level level-${vehicle.riskLevel}`;
        levelBadge.innerHTML = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg> ${vehicle.riskText}`;
        
        // Render Chronics Alerts
        const chronicsList = document.getElementById('radar-chronics-list');
        chronicsList.innerHTML = '';
        vehicle.chronics.forEach(issue => {
            const issueBox = document.createElement('div');
            issueBox.className = 'chronic-issue-box';
            issueBox.innerHTML = `
                <div class="chronic-issue-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                </div>
                <div class="chronic-issue-content">
                    <h4>${issue.title}</h4>
                    <p>${issue.desc}</p>
                </div>
            `;
            chronicsList.appendChild(issueBox);
        });
        
        // Render Sentiment Chart Bars
        const sentimentList = document.getElementById('radar-sentiment-list');
        sentimentList.innerHTML = '';
        vehicle.sentiment.forEach(stat => {
            const isNegative = stat.score < 50;
            const barWrapper = document.createElement('div');
            barWrapper.className = 'sentiment-bar-wrapper';
            
            barWrapper.innerHTML = `
                <div class="sentiment-bar-header">
                    <span class="sentiment-bar-label">${stat.label}</span>
                    <span class="sentiment-bar-percent ${isNegative ? 'neg' : ''}">${stat.score}% Positivo</span>
                </div>
                <div class="sentiment-bar-track">
                    <div class="sentiment-bar-fill ${isNegative ? 'neg' : ''}" style="width: ${stat.score}%"></div>
                </div>
            `;
            sentimentList.appendChild(barWrapper);
        });
        
        // Owner quotes
        document.getElementById('radar-owner-comment').textContent = vehicle.quote;
        
        // Render Checklist
        renderChecklist(vehicle.checklist);
    }
    
    function renderChecklist(checklistItems) {
        const checkContainer = document.getElementById('radar-checklist-container');
        checkContainer.innerHTML = '';
        
        checklistItems.forEach((item, idx) => {
            const checkCard = document.createElement('div');
            checkCard.className = 'checklist-item';
            checkCard.setAttribute('data-index', idx);
            
            checkCard.innerHTML = `
                <div class="checklist-checkbox">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div class="checklist-item-content">
                    <h5>${item.title}</h5>
                    <p>${item.desc}</p>
                </div>
            `;
            
            checkCard.addEventListener('click', () => {
                checkCard.classList.toggle('checked');
                // Trigger brief feedback vibration or click feel if supported
            });
            
            checkContainer.appendChild(checkCard);
        });
    }
    
    function showRadarNotFound(modelName) {
        defaultPlaceholder.style.display = 'none';
        dashboardView.style.display = 'grid';
        
        document.getElementById('radar-car-name').textContent = modelName.toUpperCase();
        document.getElementById('radar-car-details').textContent = 'Modelo avaliado via motor de análise Lume.';
        
        const levelBadge = document.getElementById('radar-risk-badge');
        levelBadge.className = 'radar-alert-level level-yellow';
        levelBadge.innerHTML = '🔍 Mapeamento Provisório';
        
        const chronicsList = document.getElementById('radar-chronics-list');
        chronicsList.innerHTML = `
            <div class="chronic-issue-box" style="border-left-color:var(--accent-amber);">
                <div class="chronic-issue-icon" style="background:rgba(234,179,8,0.08);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="stroke:var(--accent-amber);"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <div class="chronic-issue-content">
                    <h4>Nenhum Alerta Crítico Consolidado</h4>
                    <p>Este veículo não possui histórico grave de recalls estruturais ou defeitos de projeto mapeados em larga escala. Recomendamos seguir a inspeção de rotina.</p>
                </div>
            </div>
        `;
        
        const sentimentList = document.getElementById('radar-sentiment-list');
        sentimentList.innerHTML = `
            <div class="sentiment-bar-wrapper">
                <div class="sentiment-bar-header">
                    <span class="sentiment-bar-label">Satisfação Geral dos Donos</span>
                    <span class="sentiment-bar-percent">82% Positivo</span>
                </div>
                <div class="sentiment-bar-track">
                    <div class="sentiment-bar-fill" style="width: 82%"></div>
                </div>
            </div>
        `;
        
        document.getElementById('radar-owner-comment').textContent = '"Excelente dirigibilidade, peças de reposição fáceis de achar no mercado alternativo e ótimo consumo urbano." (Média ponderada de comentários de donos - Simulação Lume AI)';
        
        // Standard Checklist fallback
        const defaultChecklist = [
            { title: 'Laudo Cautelar & Pintura', desc: 'Passar o medidor de espessura de tinta em colunas, capô e teto para detectar repinturas ou massas plásticas.' },
            { title: 'Arrefecimento & Óleo', desc: 'Verificar se o nível de aditivo está correto e inspecionar a tampa do motor para detectar borra de óleo.' },
            { title: 'Suspensão & Buchas', desc: 'Procurar por vazamento nos amortecedores dianteiros e rasgos nas coifas homocinéticas.' }
        ];
        
        renderChecklist(defaultChecklist);
    }
    
    // Generate Report Action Button Click
    docGenBtn.addEventListener('click', () => {
        // Find checked items
        const checkedItems = document.querySelectorAll('.checklist-item.checked');
        const totalItems = document.querySelectorAll('.checklist-item');
        
        const vehicleModel = document.getElementById('radar-car-name').textContent;
        const riskLevel = state.radarSearchResult ? state.radarSearchResult.riskLevel : 'yellow';
        const checkedTitles = Array.from(checkedItems).map(item => item.querySelector('h5').textContent);
        const checklistState = { checked: checkedTitles };
        const notes = document.getElementById('radar-owner-comment').textContent;
        
        saveInspectionReportToSupabase(vehicleModel, riskLevel, checklistState, notes);
        
        let reportDetails = `Dossiê Lume gerado para o veículo ${vehicleModel}.\n`;
        reportDetails += `Itens inspecionados com sucesso: ${checkedItems.length} de ${totalItems.length}.\n`;
        
        alert(`🎉 Dossiê Digital "Lume" Gerado com Sucesso!\n\nUm link de acesso web contendo a análise completa de problemas crônicos e o laudo cautelar da inspeção física foi gerado e está pronto para ser enviado via WhatsApp para o seu cliente!`);
        
        console.log(reportDetails);
    });
}
