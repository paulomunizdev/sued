/*
 * Title:       Sued
 * Version:     Beta
 * Author:      Paulo Muniz
 * GitHub:      https://github.com/paulomunizdev/sued
 * Description: Sued is an AI designed to respond and assist in WhatsApp groups.
 */

import makeWASocket, {
  Browsers,
  DisconnectReason,
  UserFacingSocketConfig,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import { talkAction } from "./openAI";

export async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: Browsers.macOS("Desktop"),
  } as UserFacingSocketConfig);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "Conexão fechada devido a",
        lastDisconnect?.error,
        ", reconectando ",
        shouldReconnect
      );
      // Reconectar se não estiver desconectado
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("Conexão aberta");
    }
  });

  // Mensagens recebidas/enviadas pelo meu Whatsapp
  sock.ev.on("messages.upsert", async (m) => {
    // m.messages[0].key.remoteJid // endereço wpp de quem enviou
    // m.messages[0].key.fromMe // se a mensagem foi enviada por mim
    // m.messages[0].key // Nome do contato
    // m.messages[0].key.id // Id da mensagem
    // m.messages[0].message?.extendedTextMessage?.text // Mensagem de texto enviada
    // m.messages.pushName // Nome do contato

    /* 
        m.messages[0].key.remoteJid -> 
            Se tiver @s.whatsapp.net quer dizer que é pv
            Se tiver @g.us quer dizer que é grupo
        */

    if (m.messages[0].key.fromMe) return;

    // messages extendedTextMessage .text // É quando responde uma mensagem
    const extendedTextMessage =
      m.messages[0].message?.extendedTextMessage?.text;

    // messages conversation // É quando é enviado uma mensagem normal
    const conversation = m.messages[0].message?.conversation;

    // Pega texto da mensagem
    const textReceived = extendedTextMessage
      ? extendedTextMessage
      : conversation;

    if (!textReceived) return;

    // Verificar se é grupo ou privado
    const senderType = m.messages[0].key.remoteJid?.includes("@g.us")
      ? "group"
      : "private";
    if (senderType == "private") {
      const response = 'Olá, meu nome é *Sued* e eu sou uma Inteligência Artificial desenvolvida especialmente para ajudar em grupos no WhatsApp, eu não respondo no privado.\n\nby Paulo Muniz: +5562998711286';
      await sock.sendMessage(m.messages[0].key.remoteJid!, { text: response });
      return;
    }

    // Pega o prefixo da mensagem
    const regex = /\/\w+/;

    const prefixFromRegex = textReceived.match(regex)?.[0];

    const prefix = prefixFromRegex?.toString().toLowerCase();
    if (!prefix) return;

    if (textReceived.toLocaleLowerCase() == "/sued") {
      const response =
        "Olá, meu nome é *Sued* e eu sou uma Inteligência Artificial, vou tirar suas dúvidas!\n\nMe faça uma pergunta!\n\nDigite */sued* antes da sua pergunta pra se referir a mim.\n\nExemplo:\n*/sued O que é uma linguagem de programação?*";
      await sock.sendMessage(m.messages[0].key.remoteJid!, { text: response });
      return;
    }
    
    const messageKey = m.messages[0].key;

    const textReceivedWithoutPrefix = textReceived?.replace(prefix, "").trim();

    switch (prefix) {
      case "/sued":
        const suedResponse = await talkAction(textReceivedWithoutPrefix);

        // Criar função para trazer "mensagem de erro genérica que será usada em todos os casos"
        if (!suedResponse) return;

        const participant = m.messages[0].key.participant;

        
        if (!participant) return;

        await sock.sendMessage(m.messages[0].key.remoteJid!, {
          text: suedResponse,
        }, {
          quoted: m.messages[0],
        }
        );
        break;
      

      case "/help":
        console.log("Help:", prefix);
        break;
    }
  });

  // Salvar/Atualizar credenciais
  sock.ev.on("creds.update", saveCreds);
}
