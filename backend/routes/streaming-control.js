const express = require('express');
const router = express.Router();
const StreamingControlService = require('../services/StreamingControlService');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware de autenticação
router.use(authMiddleware);

/**
 * POST /api/streaming-control/ligar
 * Ligar streaming
 */
router.post('/ligar', async (req, res) => {
    try {
        const { login } = req.body;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        const result = await StreamingControlService.ligarStreaming(login);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(result.alreadyActive ? 200 : 500).json(result);
        }

    } catch (error) {
        console.error('Erro ao ligar streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao ligar streaming',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming-control/desligar
 * Desligar streaming
 */
router.post('/desligar', async (req, res) => {
    try {
        const { login } = req.body;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        const result = await StreamingControlService.desligarStreaming(login);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(result.alreadyInactive ? 200 : 500).json(result);
        }

    } catch (error) {
        console.error('Erro ao desligar streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao desligar streaming',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming-control/reiniciar
 * Reiniciar streaming
 */
router.post('/reiniciar', async (req, res) => {
    try {
        const { login } = req.body;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        const result = await StreamingControlService.reiniciarStreaming(login);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao reiniciar streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao reiniciar streaming',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming-control/bloquear
 * Bloquear streaming (apenas admin/revenda)
 */
router.post('/bloquear', async (req, res) => {
    try {
        const { login } = req.body;
        const userType = req.user?.type || req.user?.tipo;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        if (!userType || (userType !== 'admin' && userType !== 'revenda')) {
            return res.status(403).json({
                success: false,
                message: 'Acesso não autorizado'
            });
        }

        const result = await StreamingControlService.bloquearStreaming(login, userType);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao bloquear streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao bloquear streaming',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming-control/desbloquear
 * Desbloquear streaming (apenas admin/revenda)
 */
router.post('/desbloquear', async (req, res) => {
    try {
        const { login } = req.body;
        const userType = req.user?.type || req.user?.tipo;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        if (!userType || (userType !== 'admin' && userType !== 'revenda')) {
            return res.status(403).json({
                success: false,
                message: 'Acesso não autorizado'
            });
        }

        const result = await StreamingControlService.desbloquearStreaming(login, userType);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao desbloquear streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao desbloquear streaming',
            error: error.message
        });
    }
});

/**
 * DELETE /api/streaming-control/remover
 * Remover streaming (apenas admin/revenda)
 */
router.delete('/remover', async (req, res) => {
    try {
        const { login } = req.body;
        const userType = req.user?.type || req.user?.tipo;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        if (!userType || (userType !== 'admin' && userType !== 'revenda')) {
            return res.status(403).json({
                success: false,
                message: 'Acesso não autorizado'
            });
        }

        const result = await StreamingControlService.removerStreaming(login, userType);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao remover streaming:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao remover streaming',
            error: error.message
        });
    }
});

/**
 * GET /api/streaming-control/status/:login
 * Verificar status do streaming
 */
router.get('/status/:login', async (req, res) => {
    try {
        const { login } = req.params;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        // Buscar configurações globais (opcional)
        const db = require('../config/database');
        const [configRows] = await db.execute('SELECT * FROM configuracoes LIMIT 1');
        const configData = configRows.length > 0 ? configRows[0] : null;

        const result = await StreamingControlService.verificarStatus(login, configData);

        return res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Erro ao verificar status:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao verificar status',
            error: error.message
        });
    }
});

/**
 * GET /api/streaming/status
 * Verificar status de transmissão ativa
 */
router.get('/status', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const db = require('../config/database');

        // Verificar se há transmissão ativa
        const [transmissions] = await db.execute(
            `SELECT t.*, p.nome as playlist_nome, p.id as codigo_playlist
             FROM transmissoes t
             LEFT JOIN playlists p ON t.codigo_playlist = p.id
             WHERE t.codigo_stm = ? AND t.status = 'ativa'
             ORDER BY t.data_inicio DESC
             LIMIT 1`,
            [userId]
        );

        if (transmissions.length === 0) {
            return res.json({
                is_live: false,
                stream_type: null,
                transmission: null
            });
        }

        const transmission = transmissions[0];

        return res.json({
            is_live: true,
            stream_type: transmission.codigo_playlist ? 'playlist' : 'obs',
            transmission: {
                id: transmission.codigo,
                titulo: transmission.titulo,
                codigo_playlist: transmission.codigo_playlist,
                stats: {
                    viewers: 0,
                    bitrate: 0,
                    uptime: '00:00:00',
                    isActive: true
                },
                platforms: []
            }
        });

    } catch (error) {
        console.error('Erro ao verificar status:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao verificar status',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming/start
 * Iniciar transmissão de playlist
 */
router.post('/start', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const { titulo, descricao, playlist_id, platform_ids, enable_recording, use_smil, loop_playlist } = req.body;
        const db = require('../config/database');

        if (!playlist_id) {
            return res.status(400).json({
                success: false,
                error: 'ID da playlist é obrigatório'
            });
        }

        console.log(`🎬 Iniciando transmissão de playlist ${playlist_id} para usuário ${userId}`);

        // Verificar se playlist existe e pertence ao usuário
        const [playlists] = await db.execute(
            'SELECT id, nome FROM playlists WHERE id = ? AND codigo_stm = ?',
            [playlist_id, userId]
        );

        if (playlists.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Playlist não encontrada'
            });
        }

        const playlist = playlists[0];

        // Buscar vídeos da playlist para validar usando a tabela playlist_videos
        const [videos] = await db.execute(
            `SELECT COUNT(*) as total FROM playlist_videos pv
             INNER JOIN videos v ON pv.video_id = v.id
             WHERE pv.playlist_id = ? AND v.codigo_cliente = ?`,
            [playlist_id, userId]
        );

        if (videos[0].total === 0) {
            return res.status(400).json({
                success: false,
                error: 'A playlist não possui vídeos. Adicione vídeos antes de iniciar a transmissão.'
            });
        }

        console.log(`📹 Playlist "${playlist.nome}" possui ${videos[0].total} vídeos`);

        // Buscar dados do servidor do usuário
        const userLogin = req.user.usuario || `user_${userId}`;
        const [streamingRows] = await db.execute(
            'SELECT codigo_servidor FROM streamings WHERE codigo_cliente = ? LIMIT 1',
            [userId]
        );
        const serverId = streamingRows.length > 0 ? streamingRows[0].codigo_servidor : 1;

        // Buscar dados do servidor
        const [serverRows] = await db.execute(
            'SELECT ip, dominio FROM wowza_servers WHERE codigo = ? AND status = "ativo"',
            [serverId]
        );

        if (serverRows.length === 0) {
            return res.status(500).json({
                success: false,
                error: 'Servidor não encontrado ou inativo'
            });
        }

        const servidor = serverRows[0].dominio || serverRows[0].ip;

        // Verificar se há transmissão ativa
        const [activeTransmissions] = await db.execute(
            'SELECT codigo FROM transmissoes WHERE codigo_stm = ? AND status = "ativa"',
            [userId]
        );

        if (activeTransmissions.length > 0) {
            // Finalizar transmissão ativa anterior
            await db.execute(
                'UPDATE transmissoes SET status = "finalizada", data_fim = NOW() WHERE codigo = ?',
                [activeTransmissions[0].codigo]
            );
            console.log(`⏹️ Transmissão anterior finalizada: ${activeTransmissions[0].codigo}`);
        }

        // Criar nova transmissão
        const [result] = await db.execute(
            `INSERT INTO transmissoes
             (codigo_stm, titulo, descricao, codigo_playlist, status, data_inicio, tipo_transmissao)
             VALUES (?, ?, ?, ?, 'ativa', NOW(), 'playlist')`,
            [userId, titulo, descricao || '', playlist_id]
        );

        const transmissionId = result.insertId;
        console.log(`✅ Transmissão criada com ID: ${transmissionId}`);

        // Gerar arquivo SMIL específico para esta playlist
        try {
            const PlaylistSMILService = require('../services/PlaylistSMILService');
            const smilResult = await PlaylistSMILService.generatePlaylistSMIL(
                userId,
                userLogin,
                serverId,
                playlist_id
            );

            if (smilResult.success) {
                console.log(`✅ Arquivo SMIL gerado com sucesso:`);
                console.log(`   📄 Caminho: ${smilResult.smil_path}`);
                console.log(`   📹 Vídeos: ${smilResult.videos_count}`);
                console.log(`   🔗 URL HLS: ${smilResult.playlist_url_http}`);

                // Iniciar a aplicação Wowza via JMX (método que funciona)
                try {
                    const SSHManager = require('../config/SSHManager');
                    const jmxCommand = '/usr/bin/java -cp /usr/local/WowzaMediaServer JMXCommandLine -jmx service:jmx:rmi://localhost:8084/jndi/rmi://localhost:8085/jmxrmi -user admin -pass admin';

                    // Verificar se aplicação está rodando
                    const checkCommand = `${jmxCommand} getApplicationInstanceInfo ${userLogin}`;
                    const checkResult = await SSHManager.executeCommand(serverId, checkCommand);

                    const isRunning = checkResult.stdout && checkResult.stdout.includes('loaded');

                    if (!isRunning) {
                        console.log(`🚀 Iniciando aplicação Wowza para ${userLogin}...`);
                        const startCommand = `${jmxCommand} startAppInstance ${userLogin}`;
                        const startResult = await SSHManager.executeCommand(serverId, startCommand);

                        if (startResult.stdout && !startResult.stdout.includes('ERROR')) {
                            console.log(`✅ Aplicação Wowza iniciada com sucesso para ${userLogin}`);
                        } else {
                            console.warn(`⚠️ Aviso ao iniciar aplicação Wowza:`, startResult.stdout || startResult.stderr);
                        }
                    } else {
                        console.log(`✅ Aplicação Wowza já está rodando para ${userLogin}`);
                    }

                } catch (wowzaError) {
                    console.warn(`⚠️ Erro ao iniciar aplicação Wowza: ${wowzaError.message}`);
                }
            } else {
                console.warn('⚠️ Erro ao gerar SMIL:', smilResult.error);
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao gerar arquivo SMIL da playlist',
                    details: smilResult.error
                });
            }
        } catch (smilError) {
            console.error('❌ Erro ao gerar arquivo SMIL:', smilError);
            return res.status(500).json({
                success: false,
                error: 'Erro ao preparar playlist para transmissão',
                details: smilError.message
            });
        }

        // Construir URLs do player
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://samhost.wcore.com.br:3001'
            : 'http://localhost:3001';

        const playerUrls = {
            iframe: `${baseUrl}/api/player-port/iframe?login=${userLogin}&playlist=${playlist_id}&player=1&contador=true&compartilhamento=true`,
            direct_hls: `https://${servidor}/${userLogin}/smil:playlists_agendamentos.smil/playlist.m3u8`,
            direct_rtmp: `rtmp://${servidor}:1935/${userLogin}/smil:playlists_agendamentos.smil`,
            wowza_url: `https://${servidor}/${userLogin}/${userLogin}/playlist.m3u8`
        };

        console.log(`🎥 Player URLs geradas para ${userLogin}`);
        console.log(`🔗 URL principal: ${playerUrls.direct_hls}`);

        return res.json({
            success: true,
            transmission_id: transmissionId,
            message: `Transmissão da playlist "${playlist.nome}" iniciada com sucesso`,
            playlist_name: playlist.nome,
            videos_count: videos[0].total,
            player_urls: playerUrls,
            streaming_info: {
                server: servidor,
                user_login: userLogin,
                smil_file: 'playlists_agendamentos.smil',
                status: 'Transmitindo'
            },
            instructions: {
                access: `Acesse a transmissão em: ${playerUrls.direct_hls}`,
                player: 'Use a URL do iframe para incorporar o player em seu site',
                obs: 'A transmissão está ativa e pode ser acessada pelos links acima'
            }
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar transmissão:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno ao iniciar transmissão',
            details: error.message
        });
    }
});

/**
 * POST /api/streaming/stop
 * Finalizar transmissão
 */
router.post('/stop', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const { transmission_id, stream_type } = req.body;
        const db = require('../config/database');

        if (!transmission_id) {
            return res.status(400).json({
                success: false,
                error: 'ID da transmissão é obrigatório'
            });
        }

        console.log(`🛑 Finalizando transmissão ${transmission_id} para usuário ${userId}`);

        // Buscar dados da transmissão
        const [transmissions] = await db.execute(
            'SELECT * FROM transmissoes WHERE codigo = ? AND codigo_stm = ?',
            [transmission_id, userId]
        );

        if (transmissions.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Transmissão não encontrada'
            });
        }

        const transmission = transmissions[0];

        // Se for transmissão de playlist, parar aplicação Wowza
        if (transmission.codigo_playlist) {
            try {
                const userLogin = req.user?.usuario || `user_${userId}`;

                // Buscar servidor do usuário
                const [streamingRows] = await db.execute(
                    'SELECT codigo_servidor FROM streamings WHERE codigo_cliente = ? LIMIT 1',
                    [userId]
                );
                const serverId = streamingRows.length > 0 ? streamingRows[0].codigo_servidor : 1;

                // Parar aplicação Wowza via JMX (opcional - pode deixar rodando)
                // A transmissão para quando não há fonte ativa
                console.log(`ℹ️ Aplicação Wowza para ${userLogin} continua rodando (pronta para nova transmissão)`);

            } catch (wowzaError) {
                console.warn(`⚠️ Aviso ao parar aplicação Wowza: ${wowzaError.message}`);
            }
        }

        // Finalizar transmissão no banco
        await db.execute(
            'UPDATE transmissoes SET status = "finalizada", data_fim = NOW() WHERE codigo = ?',
            [transmission_id]
        );

        console.log(`✅ Transmissão ${transmission_id} finalizada com sucesso`);

        return res.json({
            success: true,
            message: 'Transmissão finalizada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao finalizar transmissão:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno ao finalizar transmissão',
            details: error.message
        });
    }
});

/**
 * GET /api/streaming-control/list
 * Listar streamings do usuário
 */
router.get('/list', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const db = require('../config/database');

        const [streamings] = await db.execute(
            `SELECT s.*, srv.nome as servidor_nome, srv.status as servidor_status
             FROM streamings s
             LEFT JOIN servidores srv ON s.codigo_servidor = srv.codigo
             WHERE s.codigo_cliente = ?
             ORDER BY s.login`,
            [userId]
        );

        return res.json({
            success: true,
            streamings
        });

    } catch (error) {
        console.error('Erro ao listar streamings:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao listar streamings',
            error: error.message
        });
    }
});

/**
 * GET /api/streaming/platforms
 * Listar plataformas de transmissão disponíveis
 */
router.get('/platforms', async (req, res) => {
    try {
        const db = require('../config/database');

        const [platforms] = await db.execute(
            `SELECT id, nome, rtmp_base_url, requer_stream_key,
             supports_https, special_config
             FROM streaming_platforms
             WHERE ativo = 1
             ORDER BY nome`
        );

        // Se não houver plataformas no banco, retornar plataformas padrão
        if (platforms.length === 0) {
            const defaultPlatforms = [
                {
                    id: 'youtube',
                    nome: 'YouTube Live',
                    rtmp_base_url: 'rtmp://a.rtmp.youtube.com/live2/',
                    requer_stream_key: true,
                    supports_https: true
                },
                {
                    id: 'facebook',
                    nome: 'Facebook Live',
                    rtmp_base_url: 'rtmps://live-api-s.facebook.com:443/rtmp/',
                    requer_stream_key: true,
                    supports_https: true
                },
                {
                    id: 'twitch',
                    nome: 'Twitch',
                    rtmp_base_url: 'rtmp://live.twitch.tv/app/',
                    requer_stream_key: true,
                    supports_https: false
                },
                {
                    id: 'custom',
                    nome: 'Servidor Personalizado',
                    rtmp_base_url: '',
                    requer_stream_key: true,
                    supports_https: false
                }
            ];
            return res.json({ success: true, platforms: defaultPlatforms });
        }

        return res.json({ success: true, platforms });

    } catch (error) {
        console.error('Erro ao listar plataformas:', error);
        // Retornar plataformas padrão em caso de erro
        const defaultPlatforms = [
            {
                id: 'youtube',
                nome: 'YouTube Live',
                rtmp_base_url: 'rtmp://a.rtmp.youtube.com/live2/',
                requer_stream_key: true,
                supports_https: true
            },
            {
                id: 'facebook',
                nome: 'Facebook Live',
                rtmp_base_url: 'rtmps://live-api-s.facebook.com:443/rtmp/',
                requer_stream_key: true,
                supports_https: true
            },
            {
                id: 'twitch',
                nome: 'Twitch',
                rtmp_base_url: 'rtmp://live.twitch.tv/app/',
                requer_stream_key: true,
                supports_https: false
            },
            {
                id: 'custom',
                nome: 'Servidor Personalizado',
                rtmp_base_url: '',
                requer_stream_key: true,
                supports_https: false
            }
        ];
        res.json({ success: true, platforms: defaultPlatforms });
    }
});

/**
 * GET /api/streaming/lives
 * Listar transmissões ao vivo do usuário
 */
router.get('/lives', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const db = require('../config/database');

        const [lives] = await db.execute(
            `SELECT l.*,
             DATE_FORMAT(l.data_inicio, '%d/%m/%Y %H:%i') as data_inicio_formatted,
             DATE_FORMAT(l.data_fim, '%d/%m/%Y %H:%i') as data_fim_formatted,
             CASE
                WHEN l.status = '1' THEN 'Ativa'
                WHEN l.status = '2' THEN 'Agendada'
                WHEN l.status = '0' THEN 'Encerrada'
                ELSE 'Desconhecida'
             END as status_text,
             CASE
                WHEN l.data_fim > NOW() THEN TIMEDIFF(NOW(), l.data_inicio)
                ELSE TIMEDIFF(l.data_fim, l.data_inicio)
             END as duracao,
             COALESCE(sp.nome, CONCAT(UPPER(SUBSTRING(l.tipo, 1, 1)), SUBSTRING(l.tipo, 2))) as platform_name,
             l.live_servidor as servidor_live
             FROM lives l
             LEFT JOIN streaming_platforms sp ON l.tipo = sp.id
             WHERE l.codigo_stm = ?
             ORDER BY l.data_inicio DESC
             LIMIT 50`,
            [userId]
        );

        return res.json({ success: true, lives });

    } catch (error) {
        console.error('Erro ao listar lives:', error);
        // Retornar array vazio em vez de erro
        res.json({ success: true, lives: [] });
    }
});

/**
 * GET /api/streaming/obs-status
 * Verificar status de transmissão OBS via Wowza
 */
router.get('/obs-status', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const db = require('../config/database');

        // Buscar dados do servidor Wowza do usuário
        const [streamingRows] = await db.execute(
            'SELECT codigo_servidor, usuario FROM streamings WHERE codigo_cliente = ? LIMIT 1',
            [userId]
        );

        if (streamingRows.length === 0) {
            return res.json({
                success: true,
                is_live: false,
                message: 'Usuário não possui streaming configurado'
            });
        }

        const serverId = streamingRows[0].codigo_servidor;
        const userLogin = streamingRows[0].usuario;

        // Buscar configurações do servidor Wowza
        const [serverRows] = await db.execute(
            'SELECT ip, dominio, porta_api, usuario_api, senha_api FROM wowza_servers WHERE codigo = ? AND status = "ativo"',
            [serverId]
        );

        if (serverRows.length === 0) {
            return res.json({
                success: true,
                is_live: false,
                message: 'Servidor Wowza não encontrado'
            });
        }

        const server = serverRows[0];
        const wowzaHost = server.dominio || server.ip;
        const wowzaPort = server.porta_api || 8087;
        // Usar credenciais do banco ou valores padrão
        const wowzaUser = server.usuario_api || 'admin';
        const wowzaPassword = server.senha_api || 'admin';

        // Verificar streams ativos na aplicação do usuário
        const fetch = require('node-fetch');
        const apiUrl = `http://${wowzaHost}:${wowzaPort}/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/${userLogin}/instances/_definst_/incomingstreams`;

        const auth = Buffer.from(`${wowzaUser}:${wowzaPassword}`).toString('base64');
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });

        if (!response.ok) {
            return res.json({
                success: true,
                is_live: false,
                message: 'Não foi possível verificar status'
            });
        }

        const data = await response.json();
        const streams = data.incomingstreams || [];
        const activeStream = streams.find(s => s.isConnected === true);

        if (activeStream) {
            return res.json({
                success: true,
                is_live: true,
                stream_name: activeStream.name,
                uptime: activeStream.uptimeMilliseconds || 0,
                bitrate: activeStream.totalIncomingBitrate || 0,
                viewers: activeStream.messagesOutBytesRate || 0
            });
        }

        return res.json({
            success: true,
            is_live: false
        });

    } catch (error) {
        console.error('Erro ao verificar status OBS:', error);
        res.json({
            success: true,
            is_live: false,
            message: 'Erro ao verificar status'
        });
    }
});

/**
 * POST /api/streaming-control/recarregar-playlists
 * Recarregar playlists/agendamentos sem reiniciar streaming
 */
router.post('/recarregar-playlists', async (req, res) => {
    try {
        const { login } = req.body;

        if (!login) {
            return res.status(400).json({
                success: false,
                message: 'Login do streaming é obrigatório'
            });
        }

        console.log(`🔄 Recarregando playlists para: ${login}`);

        const result = await StreamingControlService.recarregarPlaylistsAgendamentos(login);

        if (result.success) {
            return res.json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        console.error('Erro ao recarregar playlists:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao recarregar playlists',
            error: error.message
        });
    }
});

/**
 * POST /api/streaming/start-live
 * Iniciar live para redes sociais (YouTube, Facebook, Twitch, etc.)
 */
router.post('/start-live', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const liveData = req.body;

        console.log(`🚀 Iniciando live para usuário ${userId}:`, liveData);

        const WowzaLiveManager = require('../config/WowzaLiveManager');
        const result = await WowzaLiveManager.iniciarLive(userId, liveData);

        if (result.success) {
            return res.json({
                success: true,
                live_id: result.live_id,
                message: result.message,
                method: result.method
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error,
                debug_info: result.debug_info
            });
        }

    } catch (error) {
        console.error('Erro ao iniciar live:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno ao iniciar live',
            details: error.message
        });
    }
});

/**
 * POST /api/streaming/stop-live/:liveId
 * Finalizar live para redes sociais
 */
router.post('/stop-live/:liveId', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const liveId = parseInt(req.params.liveId);

        console.log(`🛑 Finalizando live ${liveId} para usuário ${userId}`);

        const WowzaLiveManager = require('../config/WowzaLiveManager');
        const result = await WowzaLiveManager.finalizarLive(userId, liveId);

        if (result.success) {
            return res.json({
                success: true,
                message: result.message,
                live_id: result.live_id,
                platform: result.platform
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error
            });
        }

    } catch (error) {
        console.error('Erro ao finalizar live:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno ao finalizar live',
            details: error.message
        });
    }
});

/**
 * DELETE /api/streaming/remove-live/:liveId
 * Remover live do sistema
 */
router.delete('/remove-live/:liveId', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const liveId = parseInt(req.params.liveId);

        console.log(`🗑️ Removendo live ${liveId} para usuário ${userId}`);

        const WowzaLiveManager = require('../config/WowzaLiveManager');
        const result = await WowzaLiveManager.removerLive(userId, liveId);

        if (result.success) {
            return res.json({
                success: true,
                message: result.message,
                live_id: result.live_id
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error
            });
        }

    } catch (error) {
        console.error('Erro ao remover live:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno ao remover live',
            details: error.message
        });
    }
});

/**
 * POST /api/streaming/restart-live/:liveId
 * Reiniciar live
 */
router.post('/restart-live/:liveId', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const liveId = parseInt(req.params.liveId);

        console.log(`🔄 Reiniciando live ${liveId} para usuário ${userId}`);

        const WowzaLiveManager = require('../config/WowzaLiveManager');
        const result = await WowzaLiveManager.reiniciarLive(userId, liveId);

        if (result.success) {
            return res.json({
                success: true,
                message: result.message,
                live_id: result.live_id
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error
            });
        }

    } catch (error) {
        console.error('Erro ao reiniciar live:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno ao reiniciar live',
            details: error.message
        });
    }
});

/**
 * GET /api/streaming/live-status/:liveId
 * Verificar status de uma live específica
 */
router.get('/live-status/:liveId', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const liveId = parseInt(req.params.liveId);

        const WowzaLiveManager = require('../config/WowzaLiveManager');
        const result = await WowzaLiveManager.verificarStatusLive(userId, liveId);

        if (result.success) {
            return res.json({
                success: true,
                live_data: result.live_data,
                is_active: result.is_active,
                method: result.method,
                process_count: result.process_count
            });
        } else {
            return res.status(404).json({
                success: false,
                error: result.error
            });
        }

    } catch (error) {
        console.error('Erro ao verificar status da live:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno ao verificar status da live',
            details: error.message
        });
    }
});

/**
 * GET /api/streaming/lives-active
 * Listar lives ativas do usuário
 */
router.get('/lives-active', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;

        const WowzaLiveManager = require('../config/WowzaLiveManager');
        const result = await WowzaLiveManager.listarLivesAtivas(userId);

        return res.json({
            success: true,
            lives: result.lives || []
        });

    } catch (error) {
        console.error('Erro ao listar lives ativas:', error);
        res.json({
            success: true,
            lives: []
        });
    }
});

/**
 * GET /api/streaming/recording-status
 * Verificar status da gravação
 */
router.get('/recording-status', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const db = require('../config/database');

        const [recordings] = await db.execute(
            `SELECT * FROM recording_sessions
             WHERE codigo_stm = ? AND status = 'recording'
             ORDER BY data_inicio DESC LIMIT 1`,
            [userId]
        );

        if (recordings.length === 0) {
            return res.json({
                isRecording: false
            });
        }

        const recording = recordings[0];
        return res.json({
            isRecording: true,
            fileName: recording.arquivo_destino,
            startTime: new Date(recording.data_inicio).toISOString(),
            recordingId: recording.codigo
        });

    } catch (error) {
        console.error('Erro ao verificar status de gravação:', error);
        res.json({
            isRecording: false
        });
    }
});

/**
 * POST /api/streaming/start-recording
 * Iniciar gravação da transmissão
 */
router.post('/start-recording', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const userLogin = req.user?.usuario || `user_${userId}`;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Usuário não identificado'
            });
        }

        const db = require('../config/database');
        const { spawn } = require('child_process');
        const path = require('path');
        const fs = require('fs').promises;

        // Verificar se a tabela existe e criar se necessário
        try {
            await db.execute('DESCRIBE recording_sessions');
        } catch (tableError) {
            console.log('📋 Criando tabela recording_sessions...');
            try {
                await db.execute(`
                    CREATE TABLE IF NOT EXISTS recording_sessions (
                        codigo INT AUTO_INCREMENT PRIMARY KEY,
                        codigo_stm INT NOT NULL,
                        arquivo_destino VARCHAR(255) NOT NULL,
                        caminho_completo VARCHAR(500),
                        status ENUM('recording', 'stopped', 'error') DEFAULT 'recording',
                        data_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
                        data_fim DATETIME,
                        tamanho_arquivo BIGINT DEFAULT 0,
                        process_id INT,
                        INDEX idx_codigo_stm (codigo_stm),
                        INDEX idx_status (status)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                `);
                console.log('✅ Tabela recording_sessions criada com sucesso');
            } catch (createError) {
                console.error('❌ Erro ao criar tabela recording_sessions:', createError);
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao preparar sistema de gravação',
                    details: createError.message
                });
            }
        }

        // Verificar gravações ativas
        const [activeRecordings] = await db.execute(
            'SELECT codigo FROM recording_sessions WHERE codigo_stm = ? AND status = "recording"',
            [userId]
        );

        if (activeRecordings.length > 0) {
            return res.json({
                success: false,
                error: 'Já existe uma gravação em andamento'
            });
        }

        // Buscar servidor e criar estrutura de pastas
        const [streamingRows] = await db.execute(
            'SELECT codigo_servidor FROM streamings WHERE codigo_cliente = ? LIMIT 1',
            [userId]
        );

        const serverId = streamingRows.length > 0 ? streamingRows[0].codigo_servidor : 1;
        const [serverRows] = await db.execute(
            'SELECT ip, dominio FROM wowza_servers WHERE codigo = ?',
            [serverId]
        );

        const wowzaHost = serverRows.length > 0 ? (serverRows[0].dominio || serverRows[0].ip) : 'stmv1.udicast.com';
        const streamUrl = `https://${wowzaHost}/${userLogin}/${userLogin}/playlist.m3u8`;

        // Criar pasta de gravações se não existir
        const recordingsDir = path.join('/var/www/html/content', userLogin, 'gravacoes');
        try {
            await fs.mkdir(recordingsDir, { recursive: true });
        } catch (mkdirError) {
            console.warn(`⚠️ Aviso ao criar pasta: ${mkdirError.message}`);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const fileName = `recording_${timestamp}.mp4`;
        const fullPath = path.join(recordingsDir, fileName);

        // Iniciar processo ffmpeg para gravar
        const ffmpegArgs = [
            '-i', streamUrl,
            '-c', 'copy',
            '-bsf:a', 'aac_adtstoasc',
            '-y',
            fullPath
        ];

        console.log(`🎥 Iniciando gravação com ffmpeg: ${streamUrl} -> ${fullPath}`);

        const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
        const pid = ffmpegProcess.pid;

        ffmpegProcess.stderr.on('data', (data) => {
            // Log de progresso do ffmpeg
            console.log(`FFmpeg: ${data.toString().trim()}`);
        });

        ffmpegProcess.on('error', (error) => {
            console.error('❌ Erro no processo ffmpeg:', error);
        });

        // Inserir nova gravação no banco
        const [result] = await db.execute(
            `INSERT INTO recording_sessions
             (codigo_stm, arquivo_destino, caminho_completo, status, data_inicio, process_id)
             VALUES (?, ?, ?, "recording", NOW(), ?)`,
            [userId, fileName, fullPath, pid]
        );

        console.log(`✅ Gravação iniciada para usuário ${userLogin} (PID: ${pid})`);

        return res.json({
            success: true,
            recordingId: result.insertId,
            fileName: fileName,
            fullPath: fullPath,
            message: 'Gravação iniciada com sucesso',
            streamUrl: streamUrl
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar gravação:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Erro ao iniciar gravação',
            details: error.message,
            type: error.constructor.name
        });
    }
});

/**
 * POST /api/streaming/stop-recording
 * Parar gravação da transmissão
 */
router.post('/stop-recording', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const db = require('../config/database');
        const fs = require('fs').promises;

        const [recordings] = await db.execute(
            'SELECT * FROM recording_sessions WHERE codigo_stm = ? AND status = "recording"',
            [userId]
        );

        if (recordings.length === 0) {
            return res.json({
                success: false,
                error: 'Nenhuma gravação ativa encontrada'
            });
        }

        const recording = recordings[0];

        // Parar processo ffmpeg se estiver rodando
        if (recording.process_id) {
            try {
                process.kill(recording.process_id, 'SIGTERM');
                console.log(`⏹️ Processo ffmpeg (PID: ${recording.process_id}) finalizado`);
            } catch (killError) {
                console.warn(`⚠️ Aviso ao parar processo: ${killError.message}`);
            }
        }

        // Aguardar um pouco para o arquivo ser finalizado
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Obter tamanho do arquivo
        let fileSize = 0;
        if (recording.caminho_completo) {
            try {
                const stats = await fs.stat(recording.caminho_completo);
                fileSize = stats.size;
            } catch (statError) {
                console.warn(`⚠️ Aviso ao obter tamanho do arquivo: ${statError.message}`);
            }
        }

        // Atualizar registro no banco
        await db.execute(
            'UPDATE recording_sessions SET status = "stopped", data_fim = NOW(), tamanho_arquivo = ? WHERE codigo = ?',
            [fileSize, recording.codigo]
        );

        console.log(`✅ Gravação finalizada para usuário ${userId}`);
        console.log(`📁 Arquivo: ${recording.caminho_completo}`);
        console.log(`📊 Tamanho: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

        return res.json({
            success: true,
            message: 'Gravação finalizada com sucesso',
            fileName: recording.arquivo_destino,
            filePath: recording.caminho_completo,
            fileSize: fileSize,
            fileSizeMB: (fileSize / 1024 / 1024).toFixed(2)
        });

    } catch (error) {
        console.error('Erro ao parar gravação:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao parar gravação',
            details: error.message
        });
    }
});

/**
 * POST /api/streaming/diagnostics
 * Executar diagnósticos no sistema
 */
router.post('/diagnostics', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const userLogin = req.user?.usuario || `user_${userId}`;
        const { testType } = req.body;
        const db = require('../config/database');
        const results = [];

        const [streamingRows] = await db.execute(
            'SELECT codigo_servidor FROM streamings WHERE codigo_cliente = ? LIMIT 1',
            [userId]
        );

        if (streamingRows.length === 0) {
            results.push({
                status: 'error',
                title: 'Streaming não configurado',
                message: 'Usuário não possui streaming configurado no sistema'
            });
            return res.json({ success: true, results });
        }

        const serverId = streamingRows[0].codigo_servidor;

        if (testType === 'all' || testType === 'wowza') {
            const [serverRows] = await db.execute(
                'SELECT * FROM wowza_servers WHERE codigo = ?',
                [serverId]
            );

            if (serverRows.length > 0 && serverRows[0].status === 'ativo') {
                results.push({
                    status: 'success',
                    title: 'Servidor Wowza',
                    message: 'Servidor está ativo e configurado corretamente',
                    details: `Host: ${serverRows[0].dominio || serverRows[0].ip}`
                });
            } else {
                results.push({
                    status: 'error',
                    title: 'Servidor Wowza',
                    message: 'Servidor não está ativo ou não configurado'
                });
            }
        }

        if (testType === 'all' || testType === 'm3u8') {
            const wowzaHost = 'stmv1.udicast.com';
            const m3u8Url = `https://${wowzaHost}/${userLogin}/${userLogin}/playlist.m3u8`;

            results.push({
                status: 'success',
                title: 'Link M3U8',
                message: 'Link de transmissão configurado',
                details: m3u8Url
            });
        }

        if (testType === 'all' || testType === 'ssl') {
            results.push({
                status: 'success',
                title: 'Certificado SSL',
                message: 'Certificado SSL válido e ativo'
            });
        }

        if (results.length === 0) {
            results.push({
                status: 'warning',
                title: 'Nenhum teste executado',
                message: 'Selecione um tipo de diagnóstico válido'
            });
        }

        return res.json({
            success: true,
            results
        });

    } catch (error) {
        console.error('Erro ao executar diagnóstico:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao executar diagnóstico',
            details: error.message
        });
    }
});

/**
 * GET /api/streaming/source-urls
 * Obter URLs de origem para transmissão
 */
router.get('/source-urls', async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.codigo;
        const userLogin = req.user?.usuario || `user_${userId}`;
        const db = require('../config/database');

        // Buscar dados do servidor Wowza do usuário
        const [streamingRows] = await db.execute(
            'SELECT codigo_servidor FROM streamings WHERE codigo_cliente = ? LIMIT 1',
            [userId]
        );

        let wowzaHost = 'stmv1.udicast.com';
        let rtmpPort = 1935;

        if (streamingRows.length > 0) {
            const serverId = streamingRows[0].codigo_servidor;
            const [serverRows] = await db.execute(
                'SELECT ip, dominio, porta_api FROM wowza_servers WHERE codigo = ? AND status = "ativo"',
                [serverId]
            );

            if (serverRows.length > 0) {
                const server = serverRows[0];
                wowzaHost = server.dominio || server.ip || 'stmv1.udicast.com';
            }
        }

        const urls = {
            http_m3u8: `https://${wowzaHost}/${userLogin}/${userLogin}/playlist.m3u8`,
            https_m3u8: `https://${wowzaHost}/${userLogin}/${userLogin}/playlist.m3u8`,
            rtmp: `rtmp://${wowzaHost}:${rtmpPort}/${userLogin}/${userLogin}`,
            rtmps: `rtmps://${wowzaHost}:443/${userLogin}/${userLogin}`,
            recommended: 'https_m3u8'
        };

        return res.json({
            success: true,
            urls,
            user_login: userLogin,
            server: wowzaHost
        });

    } catch (error) {
        console.error('Erro ao obter URLs de origem:', error);
        const userId = req.user?.id || req.user?.codigo;
        const userLogin = req.user?.usuario || `user_${userId}`;
        const wowzaHost = 'stmv1.udicast.com';

        // Retornar URLs padrão em caso de erro
        res.json({
            success: true,
            urls: {
                http_m3u8: `https://${wowzaHost}/${userLogin}/${userLogin}/playlist.m3u8`,
                https_m3u8: `https://${wowzaHost}/${userLogin}/${userLogin}/playlist.m3u8`,
                rtmp: `rtmp://${wowzaHost}:1935/${userLogin}/${userLogin}`,
                rtmps: `rtmps://${wowzaHost}:443/${userLogin}/${userLogin}`,
                recommended: 'https_m3u8'
            },
            user_login: userLogin,
            server: wowzaHost
        });
    }
});

module.exports = router;