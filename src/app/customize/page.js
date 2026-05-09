import { createClient } from '@/lib/supabase/server'
import { SplitViewerPanel } from '@/components/viewer/SplitViewerPanel'
import { CustomizerPanel } from '@/components/customizer/CustomizerPanel'

export const metadata = {
  title: 'Customize Your Beyblade — BeyClaft',
  description: 'Mix and match attack rings, weight disks, blade bases and emblems. See your custom Beyblade in real-time top and side view. Free to use.',
}

export default async function CustomizePage() {
  const supabase = await createClient()
  
  const { data: allParts } = await supabase
    .from('beyblade_parts')
    .select('*')
    .order('layer_order', { ascending: true })

  const parts = {
    attack_ring: [],
    weight_disk: [],
    spin_gear: [],
    face_bolt: [],
  }

  if (allParts) {
    allParts.forEach(part => {
      if (parts[part.part_type]) {
        parts[part.part_type].push(part)
      }
    })
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-background">
      {/* Left side: 2D Split Viewer */}
      <div className="w-full lg:w-[60%] flex flex-col items-center justify-center p-4 lg:p-8 relative">
        <div className="w-full max-w-4xl">
          <SplitViewerPanel />
        </div>
      </div>
      
      {/* Right side: Parts Picker */}
      <div className="w-full lg:w-[40%] h-[60vh] lg:h-[calc(100vh-64px)] lg:sticky lg:top-16">
        <CustomizerPanel parts={parts} />
      </div>
    </div>
  )
}
