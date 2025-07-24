import { useState, useActionState, useEffect } from "react";
import { FaPaperPlane, FaSyncAlt } from "react-icons/fa";

const HelldiverCommandCenter = () => {
  // Estados
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [warData, setWarData] = useState({
    status: null,
    info: null,
    news: null,
    campaign: null,
    majorOrders: null,
    planets: null,
    history: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = import.meta.env.VITE_DEEPSEEK_KEY;

  // Mapeo de palabras clave a APIs (NUEVO)
  const apiKeywordMap = {
    "estado|guerra|general": ["status", "campaign"],
    "planeta|malevelon|ubanea|tien kwan|liberación": ["status", "info", "history"],
    "orden|misión|objetivo": ["majorOrders"],
    "noticia|novedad|actualización": ["news"],
    "hola|ayuda|qué pasa": []
  };

  // Obtener datos estratégicos (optimizado)
  const fetchWarIntel = async () => {
    setIsLoading(true);
    try {
      const responses = await Promise.all([
        fetch("https://helldiverstrainingmanual.com/api/v1/war/status"),
        fetch("https://helldiverstrainingmanual.com/api/v1/war/info"),
        fetch("https://helldiverstrainingmanual.com/api/v1/war/news?limit=3"), // Solo 3 noticias
        fetch("https://helldiverstrainingmanual.com/api/v1/war/major-orders")
      ]);
      
      const [status, info, news, majorOrders] = await Promise.all(responses.map(r => r.json()));
      
      setWarData({
        status,
        info,
        news: news.slice(0, 3), // Limitar a 3 noticias
        majorOrders,
        campaign: null, // No se carga inicialmente
        planets: null,
        history: warData.history
      });
    } catch (error) {
      console.error("Error de inteligencia:", error);
      setConversation(prev => [...prev, {
        role: "assistant",
        content: "¡CA-02: Fallo en satélite de reconocimiento!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Carga inicial optimizada
  useEffect(() => {
    fetchWarIntel();
    const intelInterval = setInterval(fetchWarIntel, 120000);
    return () => clearInterval(intelInterval);
  }, []);

  // Función fetchAdditionalData CORREGIDA
const fetchAdditionalData = async (apiType) => {
  try {
    if (apiType === "campaign" && !warData.campaign) {
      const res = await fetch("https://helldiverstrainingmanual.com/api/v1/war/campaign");
      const data = await res.json(); // Primero obtenemos los datos
      setWarData(prev => ({ ...prev, campaign: data })); // Luego actualizamos el estado
    }
    if (apiType === "planets" && !warData.planets) {
      const res = await fetch("https://helldiverstrainingmanual.com/api/v1/planets");
      const data = await res.json(); // Primero obtenemos los datos
      setWarData(prev => ({ ...prev, planets: data })); // Luego actualizamos el estado
    }
  } catch (error) {
    console.error(`Error cargando ${apiType}:`, error);
  }
};

  // Identificador de APIs relevantes (NUEVO)
  const getRelevantAPIs = (userInput) => {
    const inputLower = userInput.toLowerCase();
    for (const [keywords, apis] of Object.entries(apiKeywordMap)) {
      if (new RegExp(keywords).test(inputLower)) return apis;
    }
    return null;
  };

  // Enviar mensaje optimizado
  async function sendMessageAction(_, formData) {
    const userMessage = formData.get("message");
    if (!userMessage.trim()) return;

    const updatedConversation = [
      ...conversation,
      { role: "user", content: userMessage }
    ];

    try {
      // Paso 1: Identificar APIs necesarias
      const relevantAPIs = getRelevantAPIs(userMessage);
      let contextData = {};

      if (relevantAPIs) {
        // Cargar datos adicionales bajo demanda
        await Promise.all(relevantAPIs.map(fetchAdditionalData));
        
        // Construir contexto mínimo
        if (relevantAPIs.includes("status")) contextData.status = warData.status;
        if (relevantAPIs.includes("campaign")) contextData.campaign = warData.campaign;
        if (relevantAPIs.includes("news")) contextData.news = warData.news;
        if (relevantAPIs.includes("majorOrders")) contextData.majorOrders = warData.majorOrders;
      }

      // Paso 2: Prompt optimizado
      const systemPrompt = `Eres un Helldiver. Usa estos datos (si existen) para responder en 1-2 frases:
      ${relevantAPIs ? JSON.stringify(contextData) : "Responde sin datos específicos"}
      Códigos: ¡POR LA DEMOCRACIA! (éxito) | ¡CAÑONES CARGADOS! (error)`;

      // Paso 3: Llamada eficiente a la API
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            ...updatedConversation.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: 0.5,
          max_tokens: 100 // Respuestas cortas
        })
      });

      if (!response.ok) throw new Error("CA-01: Fallo API");
      
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      setConversation([
        ...updatedConversation,
        { role: "assistant", content: aiResponse }
      ]);
    } catch (error) {
      console.error(error);
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: "¡CA-01: " + (error.message || "Fallo de transmisión") }
      ]);
    }
  }

  const [formState, formAction, isPending] = useActionState(sendMessageAction);

  return (
    <div className="right-panel">
      {/* Panel de Noticias */}
      <div className="news-panel">
        <h3 className="panel-title">NOTICIAS DEL FRENTE</h3>
        <ul className="news-items">
          {warData.news?.map((item, i) => (
            <li key={i} className="news-item">
              <span className="news-bullet">›</span> 
              <span className="news-text">{item.message}</span>
              <span className="news-time">
                {new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel de Chat */}
      <div className="chat-panel">
        <div className="messages-container">
          {conversation.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <span className="message-sender">
                {msg.role === 'user' ? 'TÚ:' : 'HELLDIVER:'}
              </span>
              <span className="message-content">{msg.content}</span>
            </div>
          ))}
        </div>
        
        <form action={formAction} className="message-form">
          <input
            type="text"
            name="message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ENVIAR MENSAJE..."
            required
          />
          <button type="submit" disabled={isLoading || isPending}>
            {isPending ? <FaSyncAlt className="spin" /> : <FaPaperPlane />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelldiverCommandCenter;