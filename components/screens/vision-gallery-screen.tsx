"use client"

import { useState, useEffect, useCallback, type CSSProperties } from 'react'
import { useApp, type VisionLifecycle } from '@/lib/app-context'
import { loadVisionImagesForGallery } from '@/lib/vision-images-api'
import { Button } from '@/components/ui/button'
import { PrimaryCTAButton } from '@/components/ui/primary-cta-button'
import { ActionButton } from '@/components/ui/action-button'
import { CreateButton } from '@/components/ui/create-button'
import { BackButton } from '@/components/ui/back-button'
import { FilterTabs } from '@/components/ui/filter-tabs'
import { ArrowLeft, Plus, Check, Star, Sparkles, Search, Archive, MessageCircle } from 'lucide-react'

const lifecycleLabels: Record<VisionLifecycle, string> = {
  active: 'Active',
  fulfilled: 'Fulfilled',
  archived: 'Archived',
  reflected: 'Reflected',
}

/** CSS background for gradient strings vs http(s) / data image URLs */
function visionPreviewStyle(imageUrl: string): CSSProperties {
  if (!imageUrl) return {}
  if (imageUrl.startsWith('linear-gradient')) {
    return { background: imageUrl }
  }
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

export function VisionGalleryScreen() {
  const { setScreen, user, markVisionFulfilled, updateVisionLifecycle, updateUser } = useApp()
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [galleryError, setGalleryError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showFulfilledDialog, setShowFulfilledDialog] = useState(false)
  const [fulfilledNote, setFulfilledNote] = useState('')
  const [reflectionNote, setReflectionNote] = useState('')
  const [showReflection, setShowReflection] = useState(false)
  const [filterTab, setFilterTab] = useState<'all' | VisionLifecycle>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterEmotion, setFilterEmotion] = useState<string | null>(null)

  const syncGalleryFromApi = useCallback(async () => {
    setGalleryError(null)
    setGalleryLoading(true)
    try {
      const images = await loadVisionImagesForGallery()
      updateUser({ visionImages: images })
    } catch (e) {
      setGalleryError(e instanceof Error ? e.message : 'Could not load visions')
    } finally {
      setGalleryLoading(false)
    }
  }, [updateUser])

  useEffect(() => {
    void syncGalleryFromApi()
  }, [syncGalleryFromApi])

  const visions = user?.visionImages || []

  // Filtering
  const filteredVisions = visions.filter(v => {
    if (filterTab !== 'all' && v.lifecycle !== filterTab) return false
    if (searchQuery && !v.prompt.toLowerCase().includes(searchQuery.toLowerCase()) && !v.lifeArea.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterEmotion && !v.tags.includes(filterEmotion)) return false
    return true
  })

  // Group by life area
  const groupedByArea = filteredVisions.reduce((acc, v) => {
    const area = v.lifeArea || 'General'
    if (!acc[area]) acc[area] = []
    acc[area].push(v)
    return acc
  }, {} as Record<string, typeof visions>)

  const selectedVision = visions.find(v => v.id === selectedId)

  const handleMarkFulfilled = () => {
    if (selectedId) {
      markVisionFulfilled(selectedId, fulfilledNote)
      setShowFulfilledDialog(false)
      setFulfilledNote('')
      setSelectedId(null)
    }
  }

  const handleReflect = () => {
    if (selectedId) {
      updateVisionLifecycle(selectedId, 'reflected', reflectionNote)
      setShowReflection(false)
      setReflectionNote('')
    }
  }

  const handleArchive = () => {
    if (selectedId) {
      updateVisionLifecycle(selectedId, 'archived')
      setSelectedId(null)
    }
  }

  // Detail view
  if (selectedVision) {
    return (
      <div className="flex flex-col min-h-dvh bg-background">
        <header className="px-6 pt-8 pb-4 flex items-center justify-between">
          <BackButton onClick={() => setSelectedId(null)}>
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </BackButton>
          <h1 className="font-serif text-lg font-medium text-foreground">Vision Detail</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="w-full aspect-square rounded-3xl mb-6 animate-fade-in-up relative overflow-hidden bg-secondary" style={visionPreviewStyle(selectedVision.imageUrl)}>
            <div className="absolute top-4 right-4 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedVision.lifecycle === 'fulfilled' ? 'bg-primary text-primary-foreground' :
                  selectedVision.lifecycle === 'archived' ? 'bg-muted text-muted-foreground' :
                    selectedVision.lifecycle === 'reflected' ? 'bg-accent text-accent-foreground' :
                      'bg-card/80 text-foreground'
                }`}>
                {lifecycleLabels[selectedVision.lifecycle]}
              </span>
            </div>
            {selectedVision.mediaType !== 'image' && (
              <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-foreground">
                {selectedVision.mediaType === 'video' ? 'Video' : 'Animated'}
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-sm text-muted-foreground mb-1">Prompt</p>
            <p className="text-foreground italic">{'"'}{selectedVision.prompt}{'"'}</p>
          </div>

          <div className="flex gap-3 mb-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex-1 bg-card rounded-2xl p-4 border border-border text-center">
              <p className="text-xs text-muted-foreground">Life Area</p>
              <p className="font-medium text-foreground text-sm mt-1">{selectedVision.lifeArea}</p>
            </div>
            <div className="flex-1 bg-card rounded-2xl p-4 border border-border text-center">
              <p className="text-xs text-muted-foreground">Belief</p>
              <p className="font-medium text-foreground text-sm mt-1">{selectedVision.beliefLevel}/5</p>
            </div>
            <div className="flex-1 bg-card rounded-2xl p-4 border border-border text-center">
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="font-medium text-foreground text-sm mt-1">{new Date(selectedVision.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Variants */}
          {selectedVision.variants.length > 1 && (
            <div className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Version History</p>
              <div className="flex gap-2">
                {selectedVision.variants.map((v, i) => (
                  <div key={i} className="w-16 h-16 rounded-xl bg-muted" style={visionPreviewStyle(v)} />
                ))}
              </div>
            </div>
          )}

          {/* Fulfillment note */}
          {selectedVision.isFulfilled && selectedVision.fulfilledNote && (
            <div className="bg-primary/10 rounded-2xl p-5 mb-4 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <div className="flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-primary" /><p className="font-medium text-foreground">Fulfillment Note</p></div>
              <p className="text-muted-foreground text-sm">{selectedVision.fulfilledNote}</p>
            </div>
          )}

          {/* Reflection note */}
          {selectedVision.reflectionNote && (
            <div className="bg-accent/20 rounded-2xl p-5 mb-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 mb-2"><MessageCircle className="w-4 h-4 text-accent-foreground" /><p className="font-medium text-foreground">Reflection</p></div>
              <p className="text-muted-foreground text-sm">{selectedVision.reflectionNote}</p>
            </div>
          )}

          {/* Fulfilled dialog */}
          {showFulfilledDialog && (
            <div className="bg-card rounded-2xl p-5 border-2 border-primary mb-4 animate-fade-in-up">
              <p className="font-medium text-foreground mb-3">How did this manifest?</p>
              <textarea value={fulfilledNote} onChange={(e) => setFulfilledNote(e.target.value)} placeholder="Describe the synchronicity or fulfillment..." className="w-full h-24 bg-background border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3" />
              <Button onClick={handleMarkFulfilled} className="w-full h-12 rounded-2xl">Confirm Fulfilled</Button>
            </div>
          )}

          {/* Reflection dialog */}
          {showReflection && (
            <div className="bg-card rounded-2xl p-5 border-2 border-accent mb-4 animate-fade-in-up">
              <p className="font-medium text-foreground mb-3">Reflect on this vision</p>
              <textarea value={reflectionNote} onChange={(e) => setReflectionNote(e.target.value)} placeholder="What does this vision mean to you now?" className="w-full h-24 bg-background border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3" />
              <Button onClick={handleReflect} className="w-full h-12 rounded-2xl">Save Reflection</Button>
            </div>
          )}
        </main>

        {/* Action buttons */}
        {selectedVision.lifecycle === 'active' && !showFulfilledDialog && !showReflection && (
          <div className="px-6 py-6 space-y-3">
            <PrimaryCTAButton icon={<Check className="w-5 h-5" />} onClick={() => setShowFulfilledDialog(true)}>
              Mark as Fulfilled
            </PrimaryCTAButton>
            <div className="flex gap-3">
              <ActionButton icon={<MessageCircle className="w-4 h-4" />} onClick={() => setShowReflection(true)}>
                Reflect
              </ActionButton>
              <ActionButton icon={<Archive className="w-4 h-4" />} onClick={handleArchive}>
                Archive
              </ActionButton>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Gallery List
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <BackButton onClick={() => setScreen('home')}>
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </BackButton>
        <h1 className="font-serif text-lg font-medium text-foreground">My Visions</h1>
        <button onClick={() => setScreen('vision-generator')} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center" aria-label="New vision">
          <Plus className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {galleryLoading && (
          <p className="text-sm text-muted-foreground mb-3">Loading your visions...</p>
        )}
        {galleryError && (
          <p className="text-sm text-destructive mb-3" role="alert">
            {galleryError}
          </p>
        )}
        {/* Search */}
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by prompt, area, emotion..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
        </div>

        {/* Lifecycle filter tabs */}
        <FilterTabs
          tabs={[
            { value: 'all', label: 'All', suffix: `(${visions.length})` },
            { value: 'active', label: lifecycleLabels.active, suffix: `(${visions.filter(v => v.lifecycle === 'active').length})` },
            { value: 'fulfilled', label: lifecycleLabels.fulfilled, suffix: `(${visions.filter(v => v.lifecycle === 'fulfilled').length})` },
            { value: 'archived', label: lifecycleLabels.archived, suffix: `(${visions.filter(v => v.lifecycle === 'archived').length})` },
            { value: 'reflected', label: lifecycleLabels.reflected, suffix: `(${visions.filter(v => v.lifecycle === 'reflected').length})` },
          ]}
          value={filterTab}
          onChange={setFilterTab}
          className="mb-4"
        />

        {filteredVisions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center pt-20 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-foreground mb-2">{searchQuery ? 'No matches' : 'No visions yet'}</h2>
            <p className="text-muted-foreground max-w-[260px] mb-8">{searchQuery ? 'Try a different search term.' : 'Create your first AI-generated vision and start living in the end.'}</p>
            {!searchQuery && (
              <CreateButton icon={<Plus className="w-5 h-5" />} onClick={() => setScreen('vision-generator')}>
                Create First Vision
              </CreateButton>
            )}
          </div>
        ) : (
          <>
            {/* Grouped by intention */}
            {Object.entries(groupedByArea).map(([area, areaVisions]) => (
              <div key={area} className="mb-6 animate-fade-in-up">
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">{area}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {areaVisions.map((vision) => (
                    <button key={vision.id} onClick={() => setSelectedId(vision.id)} className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-secondary">
                      <div className="absolute inset-0" style={visionPreviewStyle(vision.imageUrl)} />
                      {vision.lifecycle === 'fulfilled' && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Star className="w-4 h-4" /></div>
                      )}
                      {vision.lifecycle === 'archived' && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center"><Archive className="w-4 h-4" /></div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2">
                        <p className="text-xs text-foreground truncate">{vision.lifeArea}</p>
                        <div className="flex gap-0.5 mt-1">{[1, 2, 3, 4, 5].map(l => <div key={l} className={`w-1.5 h-1.5 rounded-full ${l <= vision.beliefLevel ? 'bg-primary' : 'bg-border'}`} />)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  )
}
