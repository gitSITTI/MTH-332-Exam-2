import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LinearCongruenceModule from './LinearCongruenceModule.jsx'
import CrtModule from './CrtModule.jsx'

export default function Section4_4Tools({ practice }) {
  return (
    <Tabs defaultValue="lin" className="w-full">
      <TabsList className="flex flex-wrap">
        <TabsTrigger value="lin">Linear Congruence</TabsTrigger>
        <TabsTrigger value="crt">CRT (coprime)</TabsTrigger>
      </TabsList>
      <TabsContent value="lin">
        <LinearCongruenceModule practice={practice} />
      </TabsContent>
      <TabsContent value="crt">
        <CrtModule practice={practice} />
      </TabsContent>
    </Tabs>
  )
}

