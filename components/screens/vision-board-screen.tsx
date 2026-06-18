"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { CreateButton } from '@/components/ui/create-button'
import { BackButton } from '@/components/ui/back-button'
import { SelectablePill } from '@/components/ui/selectable-pill'
import { ArrowLeft, Plus, Download, Maximize2, LayoutGrid, Rows3, Smartphone, Monitor, Play, Pause } from 'lucide-react'

const textOverlays = [
  'It is done.',
  'I am living in the end.',
  'The wish is fulfilled.',
  'I am grateful.',
  'Everything is working out for me.',
  'I AM.',
]

const autoLayouts = [
  { id: 'grid', label: 'Grid', icon: LayoutGrid },
  { id: 'masonry', label: 'Masonry', icon: Rows3 },
  { id: 'focus', label: 'Focus', icon: Maximize2 },
]

export function VisionBoardScreen() {
  const { setScreen, user, updateUser } = useApp()
  const [layout, setLayout] = useState<'grid' | 'masonry' | 'focus'>('grid')
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [exportTarget, setExportTarget] = useState<string | null>(null)

  const visions = user?.visionImages || []
  const boardItems = user?.visionBoardItems || []

  const addToBoardToggle = (visionId: string) => {
    if (!user) return
    const newItems = boardItems.includes(visionId)
      ? boardItems.filter(id => id !== visionId)
      : [...boardItems, visionId]
    updateUser({ visionBoardItems: newItems })
  }

  const boardVisions = visions.filter(v => boardItems.includes(v.id))

  // Auto-layout suggestion based on goal types
  const suggestLayout = () => {
    if (boardVisions.length <= 2) return 'focus'
    if (boardVisions.length <= 4) return 'grid'
    return 'masonry'
  }

  // Fullscreen animated board view
  if (isFullscreen && boardVisions.length > 0) {
    return (
      <div
        className="min-h-dvh relative overflow-hidden"
        style={{ background: 'oklch(0.10 0.01 50)' }}
        onClick={() => setIsFullscreen(false)}
      >
        {/* Animated: carousel cycle through visions */}
        {isAnimating ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full animate-fade-in-up" style={{
              background: boardVisions[Math.floor(Date.now() / 3000) % boardVisions.length]?.imageUrl,
              transition: 'background 1s ease-in-out',
            }} />
          </div>
        ) : (
          <div className={`grid gap-2 h-full p-3 ${layout === 'focus' ? 'grid-cols-1' :
              boardVisions.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
            }`}>
            {boardVisions.map((vision) => (
              <div
                key={vision.id}
                className="rounded-xl overflow-hidden relative"
                style={{
                  background: vision.imageUrl,
                  minHeight: layout === 'focus' ? '80vh' : boardVisions.length <= 4 ? '45vh' : '30vh',
                }}
              />
            ))}
          </div>
        )}

        {selectedOverlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-serif text-4xl font-medium text-center px-8" style={{ color: 'oklch(0.98 0.01 80)', textShadow: '0 2px 20px oklch(0 0 0 / 0.5)' }}>
              {selectedOverlay}
            </p>
          </div>
        )}

        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setIsAnimating(!isAnimating) }}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'oklch(0 0 0 / 0.5)', color: 'oklch(1 0 0)' }}
          >
            {isAnimating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsFullscreen(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'oklch(0 0 0 / 0.5)', color: 'oklch(1 0 0)' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <BackButton onClick={() => setScreen('home')}>
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </BackButton>
        <h1 className="font-serif text-lg font-medium text-foreground">Vision Board</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {boardVisions.length === 0 && visions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center pt-16 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <LayoutGrid className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-foreground mb-2">Create Your Vision Board</h2>
            <p className="text-muted-foreground max-w-[260px] mb-6">Generate AI visions first, then arrange them on your personal board.</p>
            <CreateButton icon={<Plus className="w-5 h-5" />} onClick={() => setScreen('vision-generator')}>
              Generate Visions
            </CreateButton>
          </div>
        ) : (
          <>
            {/* Layout selector */}
            <div className="flex gap-2 mb-4 animate-fade-in-up">
              {autoLayouts.map((l) => {
                const Icon = l.icon
                return (
                  <button
                    key={l.id}
                    onClick={() => setLayout(l.id as typeof layout)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${layout === l.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {l.label}
                  </button>
                )
              })}
            </div>

            {/* Auto-layout suggestion */}
            {boardVisions.length > 0 && layout !== suggestLayout() && (
              <button onClick={() => setLayout(suggestLayout() as typeof layout)} className="w-full mb-4 p-3 bg-primary/10 rounded-xl text-sm text-primary font-medium text-center animate-fade-in-up">
                Suggested layout: {suggestLayout()} (based on {boardVisions.length} items)
              </button>
            )}

            {/* Board Preview */}
            {boardVisions.length > 0 && (
              <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">My Board ({boardVisions.length})</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setIsFullscreen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Maximize2 className="w-3 h-3" />Fullscreen
                    </button>
                  </div>
                </div>

                <div className={`grid gap-2 ${layout === 'focus' ? 'grid-cols-1' :
                    layout === 'grid' ? (boardVisions.length <= 2 ? 'grid-cols-2' : 'grid-cols-3') :
                      'grid-cols-2'
                  }`}>
                  {boardVisions.map((vision, index) => (
                    <div
                      key={vision.id}
                      className={`rounded-xl overflow-hidden relative ${layout === 'masonry' && index % 3 === 0 ? 'row-span-2' : ''
                        }`}
                      style={{
                        background: vision.imageUrl,
                        aspectRatio: layout === 'focus' ? '16/10' : layout === 'masonry' && index % 3 === 0 ? '1/2' : '1/1',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Export options */}
            {boardVisions.length > 0 && (
              <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Export as</h3>
                <div className="flex gap-2">
                  {[
                    { id: 'wallpaper', icon: Smartphone, label: 'Phone Wallpaper' },
                    { id: 'desktop', icon: Monitor, label: 'Desktop' },
                    { id: 'video', icon: Play, label: 'Video Loop' },
                  ].map((opt) => {
                    const Icon = opt.icon
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setExportTarget(exportTarget === opt.id ? null : opt.id)}
                        className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-colors ${exportTarget === opt.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
                {exportTarget && (
                  <Button className="w-full h-11 rounded-xl mt-3 gap-2">
                    <Download className="w-4 h-4" />
                    Export {exportTarget === 'video' ? 'Video Loop' : exportTarget === 'wallpaper' ? 'Wallpaper' : 'Desktop Image'}
                  </Button>
                )}
              </div>
            )}

            {/* Text Overlay Selection */}
            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Text overlay</h3>
              <div className="flex flex-wrap gap-2">
                {textOverlays.map((text) => (
                  <SelectablePill
                    key={text}
                    selected={selectedOverlay === text}
                    onClick={() => setSelectedOverlay(selectedOverlay === text ? null : text)}
                  >
                    {text}
                  </SelectablePill>
                ))}
              </div>
            </div>

            {/* Available Visions */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Available Visions (tap to add/remove)</h3>
              <div className="grid grid-cols-3 gap-2">
                {visions.map((vision) => {
                  const isOnBoard = boardItems.includes(vision.id)
                  return (
                    <button key={vision.id} onClick={() => addToBoardToggle(vision.id)} className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-colors ${isOnBoard ? 'border-primary' : 'border-transparent'}`}>
                      <div className="absolute inset-0" style={{ background: vision.imageUrl }} />
                      {isOnBoard && (<div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{'✓'}</div>)}
                    </button>
                  )
                })}
                <button onClick={() => setScreen('vision-generator')} className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
