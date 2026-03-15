export default function Loading() {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh", 
        background: "#F5E6D0" 
      }}>
        <p style={{ 
          fontFamily: "serif", 
          fontSize: "1.2rem", 
          color: "#5A0F24" 
        }}>
          Cargando...
        </p>
      </div>
    );
  }