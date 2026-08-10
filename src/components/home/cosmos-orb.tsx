type CosmosOrbProps = {
  className?: string;
};

export function CosmosOrb({ className = "" }: CosmosOrbProps) {
  return (
    <div className={`cosmos-scene ${className}`} aria-hidden="true">
      <div className="cosmos-glow" />
      <div className="cosmos-orbit cosmos-orbit-outer">
        <span className="cosmos-moon cosmos-moon-acid" />
      </div>
      <div className="cosmos-orbit cosmos-orbit-middle">
        <span className="cosmos-moon cosmos-moon-orange" />
      </div>
      <div className="cosmos-orbit cosmos-orbit-inner">
        <span className="cosmos-moon cosmos-moon-white" />
      </div>
      <div className="cosmos-planet">
        <div className="cosmos-atmosphere" />
        <div className="cosmos-surface" />
        <div className="cosmos-shadow" />
        <div className="cosmos-shine" />
      </div>
      <div className="cosmos-ring cosmos-ring-back" />
      <div className="cosmos-ring cosmos-ring-front" />
      <span className="cosmos-star cosmos-star-one" />
      <span className="cosmos-star cosmos-star-two" />
      <span className="cosmos-star cosmos-star-three" />
    </div>
  );
}
