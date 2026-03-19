import { useEffect, useState, type ComponentType } from "react";
import { modules as discoveredModules } from "./.generated/mockup-components";

type ModuleMap = Record<string, () => Promise<Record<string, unknown>>>;

function _resolveComponent(
  mod: Record<string, unknown>,
  name: string,
): ComponentType | undefined {
  const fns = Object.values(mod).filter(
    (v) => typeof v === "function",
  ) as ComponentType[];
  return (
    (mod.default as ComponentType) ||
    (mod.Preview as ComponentType) ||
    (mod[name] as ComponentType) ||
    fns[fns.length - 1]
  );
}

function PreviewRenderer({
  componentPath,
  modules,
}: {
  componentPath: string;
  modules: ModuleMap;
}) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setComponent(null);
    setError(null);

    async function loadComponent(): Promise<void> {
      // 대소문자 무관하게 파일을 찾도록 강화되었습니다.
      const availableKeys = Object.keys(modules);
      const targetKey = `./components/mockups/${componentPath}.tsx`.toLowerCase();
      const actualKey = availableKeys.find(k => k.toLowerCase() === targetKey) || `./components/mockups/${componentPath}.tsx`;

      const loader = modules[actualKey];
      if (!loader) {
        setError(`파일을 찾을 수 없습니다: ${componentPath}.tsx\n파일이 src/components/mockups 폴더에 있는지 확인해주세요.`);
        return;
      }

      try {
        const mod = await loader();
        if (cancelled) return;
        const name = componentPath.split("/").pop()!;
        const comp = _resolveComponent(mod, name);
        if (!comp) {
          setError(`${componentPath}.tsx 파일 안에 'export default' 컴포넌트가 없습니다.`);
          return;
        }
        setComponent(() => comp);
      } catch (e) {
        if (cancelled) return;
        setError(`로딩 오류: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    void loadComponent();
    return () => { cancelled = true; };
  }, [componentPath, modules]);

  if (error) return <pre style={{ color: "red", padding: "2rem", backgroundColor: "#fff5f5" }}>{error}</pre>;
  if (!Component) return <div style={{ padding: "2rem" }}>화면을 불러오는 중...</div>;
  return <Component />;
}

function App() {
  // 항상 'Home' 컴포넌트를 기본으로 불러옵니다.
  return (
    <PreviewRenderer
      componentPath="Home"
      modules={discoveredModules}
    />
  );
}

export default App;