// next-themes モジュールが公式に型を提供していないため、手動で定義する型ファイル
declare module "next-themes" {
    import { ComponentType } from "react";
  
    // ThemeProvider に渡せる props（属性）の型を定義
    interface ThemeProviderProps {
      attribute?: string;                   
      defaultTheme?: string;                 
      enableSystem?: boolean;                
      disableTransitionOnChange?: boolean;  
      children?: React.ReactNode;            
    }
  
    // ThemeProvider をその型でエクスポート
    export const ThemeProvider: ComponentType<ThemeProviderProps>;
  }
  