import { Suspense, useState, Component, ReactNode } from "react"
import Spline from "@splinetool/react-spline"

class SplineErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function SplineFallback() {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, hsl(210 100% 56% / 0.15) 0%, transparent 70%)",
        }}
      />
    </div>
  )
}

export default function SplineScene() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="absolute inset-0 w-full h-full bg-background">
      {isLoading && <SplineFallback />}

      <SplineErrorBoundary fallback={<SplineFallback />}>
        <Suspense fallback={<SplineFallback />}>
          <Spline
            scene="https://prod.spline.design/l8gr6AhxxCqDIdBx/scene.splinecode"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            style={{ width: "100%", height: "100%", background: "transparent" }}
          />
        </Suspense>
      </SplineErrorBoundary>
    </div>
  )
}
