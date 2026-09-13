        // Conexão com o Supabase
        const SUPABASE_URL = 'https://hzgdlplaaohpslkxjeyi.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_hMYuO_5mTZyR4EEOYfGe0Q_Ajb3CvTy';
        const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        // Troca de Abas
        function mudarAba(idDaAba, elemento) {
            document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
            document.querySelectorAll('.menu-botoes button').forEach(btn => btn.classList.remove('ativo'));

            document.getElementById(idDaAba).classList.add('ativa');
            elemento.classList.add('ativo');
        }

        // Cronômetro
        const dataCasamento = new Date("Oct 10, 2026 00:00:00").getTime();

        setInterval(function () {
            const agora = new Date().getTime();
            const distancia = dataCasamento - agora;

            document.getElementById("dias").innerText = Math.floor(distancia / (1000 * 60 * 60 * 24));
            document.getElementById("horas").innerText = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById("minutos").innerText = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("segundos").innerText = Math.floor((distancia % (1000 * 60)) / 1000);
        }, 1000);

        // Elementos da Busca Customizada
        const inputNome = document.getElementById('nome');
        const ulSugestoes = document.getElementById('sugestoes-mobile');
        let listaConvidadosCache = [];

        // Carrega os nomes do banco de dados
        async function carregarConvidados() {
            const { data, error } = await _supabase
                .from('convidados')
                .select('id, nome')
                .is('vai_comparecer', null);

            if (!error && data) {
                listaConvidadosCache = data;
            }
        }

        carregarConvidados();

        // Evento ao digitar no campo de nome (Mobile e Desktop)
        inputNome.addEventListener('input', () => {
            const termo = inputNome.value.trim().toLowerCase();
            ulSugestoes.innerHTML = '';

            if (termo.length === 0) {
                ulSugestoes.style.display = 'none';
                return;
            }

            const filtrados = listaConvidadosCache.filter(c =>
                c.nome.toLowerCase().includes(termo)
            );

            if (filtrados.length > 0) {
                filtrados.forEach(c => {
                    const li = document.createElement('li');
                    li.textContent = c.nome;
                    li.style.padding = '10px';
                    li.style.cursor = 'pointer';
                    li.style.borderBottom = '1px solid #eee';

                    li.addEventListener('click', () => {
                        inputNome.value = c.nome;
                        ulSugestoes.style.display = 'none';
                    });

                    ulSugestoes.appendChild(li);
                });
                ulSugestoes.style.display = 'block';
            } else {
                ulSugestoes.style.display = 'none';
            }
        });

        // Esconde as sugestões se clicar fora
        document.addEventListener('click', (e) => {
            if (e.target !== inputNome && e.target !== ulSugestoes) {
                ulSugestoes.style.display = 'none';
            }
        });

        // Envio do Formulário
        const form = document.getElementById('formRsvp');
        form.addEventListener('submit', async (evento) => {
            evento.preventDefault();

            const nomeDigitado = inputNome.value.trim().toLowerCase();
            const vaiComparecer = document.getElementById('vaiComparecer').value === 'true';

            const convidadoEncontrado = listaConvidadosCache.find(
                c => c.nome.toLowerCase() === nomeDigitado
            );

            if (!convidadoEncontrado) {
                alert('Seu nome não foi encontrado na lista de convidados. Por favor, selecione seu nome na lista de sugestões.');
                return;
            }

            const { error } = await _supabase
                .from('convidados')
                .update({
                    vai_comparecer: vaiComparecer,
                    respondido_em: new Date().toISOString()
                })
                .eq('id', convidadoEncontrado.id);

            if (error) {
                alert('Erro ao salvar resposta: ' + error.message);
            } else {
                alert('Presença confirmada com sucesso!');
                form.reset();
                carregarConvidados();
            }
        });
        function presentear(nomePresente, valor) {
            const chavePix = "11919924146"; // Coloque seu CPF, e-mail ou chave aleatória aqui

            navigator.clipboard.writeText(chavePix);
            alert(`Obrigado pelo carinho!\n\nVocê escolheu: ${nomePresente} (R$ ${valor})\n\nA nossa chave Pix foi copiada automaticamente: ${chavePix}`);
        }
        // Substitua pela sua chave PIX real aqui:
        const MINHA_CHAVE_PIX = "11919924146"; // Exemplo de chave PIX (pode ser CPF, e-mail, telefone ou chave aleatória)

        function presentear(nome, valor) {
            // Converte o valor para o formato de moeda brasileira (ex: 269.09 -> R$ 269,09)
            const valorFormatado = parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            // Atualiza os textos dentro da modal
            document.getElementById('nomePresenteModal').innerText = nome;
            document.getElementById('valorPresenteModal').innerText = valorFormatado;
            document.getElementById('chavePix').value = MINHA_CHAVE_PIX;

            // Reseta o texto do botão caso já tenha sido clicado antes
            const btn = document.getElementById('btnCopiarPix');
            btn.innerText = "Copiar PIX";
            btn.style.backgroundColor = "#D10068";

            // Exibe a modal
            document.getElementById('modalPresente').style.display = 'flex';
        }

        function fecharModal() {
            document.getElementById('modalPresente').style.display = 'none';
        }

        function copiarPix() {
            const campoPix = document.getElementById('chavePix');

            // Copia o texto para a área de transferência
            navigator.clipboard.writeText(campoPix.value).then(() => {
                const btn = document.getElementById('btnCopiarPix');
                btn.innerText = "✓ PIX Copiado!";
                btn.style.backgroundColor = "#28a745"; // Fica verde para confirmar
            });
        }

        // Fecha o pop-up se o usuário clicar fora da caixa branca
        window.onclick = function (event) {
            const modal = document.getElementById('modalPresente');
            if (event.target === modal) {
                fecharModal();
            }
        }