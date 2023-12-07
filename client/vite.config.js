import { defineConfig } from 'vite'
import dns from 'dns'
import react from '@vitejs/plugin-react-swc'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      "/api":{
        target:"http://localhost:8000",
        secure:false
      },
    },
  },
  plugins: [react()],
  
  
})


