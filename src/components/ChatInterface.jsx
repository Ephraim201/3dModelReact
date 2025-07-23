import { useState, useActionState, useEffect } from "react";
import { FaPaperPlane, FaSyncAlt, FaInfoCircle } from "react-icons/fa";

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

  // Obtener inteligencia de guerra
  const fetchWarIntel = async () => {
    setIsLoading(true);
    try {
      const endpoints = [
        "https://helldiverstrainingmanual.com/api/v1/war/status",
        "https://helldiverstrainingmanual.com/api/v1/war/info",
        "https://helldiverstrainingmanual.com/api/v1/war/news",
        "https://helldiverstrainingmanual.com/api/v1/war/campaign",
        "https://helldiverstrainingmanual.com/api/v1/war/major-orders",
        "https://helldiverstrainingmanual.com/api/v1/planets"
      ];

      const responses = await Promise.all(endpoints.map(url => fetch(url)));
      const data = await Promise.all(responses.map(res => res.json()));

      setWarData({
        status: data[0],
        info: data[1],
        news: data[2],
        campaign: data[3],
        majorOrders: data[4],
        planets: data[5],
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

  // Carga inicial y actualización periódica
  useEffect(() => {
    fetchWarIntel();
    const intelInterval = setInterval(fetchWarIntel, 120000);
    return () => clearInterval(intelInterval);
  }, []);

  // Obtener historial planetario
  const fetchPlanetHistory = async (planetIndex) => {
    if (warData.history[planetIndex]) return;
    
    try {
      const response = await fetch(
        `https://helldiverstrainingmanual.com/api/v1/war/history/${planetIndex}`
      );
      const data = await response.json();
      
      setWarData(prev => ({
        ...prev,
        history: { ...prev.history, [planetIndex]: data }
      }));
    } catch (error) {
      console.error(`CA-03: Error en historial planeta ${planetIndex}`, error);
    }
  };

  // Buscar índice de planeta con validación
  const getPlanetIndex = (planetName) => {
    if (!warData.info || typeof warData.info !== 'object') return null;
    
    const planet = Object.values(warData.info).find(
      p => p?.name && typeof p.name === 'string' && 
           p.name.toLowerCase() === planetName.toLowerCase()
    );
    
    return planet?.index || null;
  };

  // Enviar mensaje
  async function sendMessageAction(_, formData) {
    const userMessage = formData.get("message");
    if (!userMessage.trim()) return;

    const updatedConversation = [
      ...conversation,
      { role: "user", content: userMessage }
    ];

    try {
      // Detección de planetas
      const planetMatch = userMessage.match(/Malevelon Creek|Ubanea|Tien Kwan|planeta (\w+)/i);
      let activePlanetIndex = null;
      
      if (planetMatch) {
        activePlanetIndex = getPlanetIndex(planetMatch[0]);
        if (activePlanetIndex) fetchPlanetHistory(activePlanetIndex);
      }

      // System prompt dinámico
      const systemPrompt = `
        Eres un oficial Helldiver. Responde en 1-2 frases usando estos datos:
        ESTADO GUERRA: ${JSON.stringify(warData.status || "No disponible")}
        PLANETAS ACTIVOS: ${JSON.stringify(warData.campaign || "No disponible")}
        ${activePlanetIndex ? `HISTORIAL: ${JSON.stringify(warData.history[activePlanetIndex]) || "Cargando..."}` : ""}
        NOTICIAS: ${warData.news?.slice(0, 3).map(n => n.message).join(" | ") || "Sin actualizaciones"}
        Códigos: ¡POR SUPERTIERRA! (Éxito) | ¡SANTA LIBERTAD! (Error)
      `;

      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...updatedConversation.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: 0.5,
          max_tokens: 150
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
    {/* Noticias - Parte superior derecha */}
    <div className="news-panel">
      <h3 className="panel-title">NOTICIAS DEL FRENTE</h3>
      <ul className="news-items">
        {warData.news?.slice(0, 5).map((item, i) => (
          <li key={i}>
            <span className="news-bullet">›</span> 
            <span className="news-text">{item.message}</span>
            <span className="news-time">{new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Chat - Parte inferior derecha */}
    <div className="chat-panel">
      <div className="messages-container">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <span className="message-sender">{msg.role === 'user' ? 'TÚ:' : 'HELLDIVER:'}</span>
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
        <button type="submit" disabled={isPending}>
          {isPending ? "..." : "↑"}
        </button>
      </form>
    </div>
  </div>
);
};

export default HelldiverCommandCenter;