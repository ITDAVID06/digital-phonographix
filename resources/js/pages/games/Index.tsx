import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, RotateCcw, Sparkles, Home } from "lucide-react"
import { OpenAnswerKeyButton } from "@/components/custom/open-answer-key-button"
import WordListSlideshow from "@/components/games/word-list-slideshow"
import { Letter } from "@/types/games"
import { GAME_CATEGORIES } from "@/data/game-categories"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

export default function GamesPage() {
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0)
    const [selectedGameIndex, setSelectedGameIndex] = useState(0)
    const [selectedWordIndex, setSelectedWordIndex] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [expandedCategories, setExpandedCategories] = useState<number[]>([0])

    const [auditoryLetters, setAuditoryLetters] = useState<Letter[]>([])
    const [auditoryDropped, setAuditoryDropped] = useState<(Letter | null)[]>([null, null, null])
    const [auditoryDragged, setAuditoryDragged] = useState<Letter | null>(null)
    const [auditoryCorrect, setAuditoryCorrect] = useState<boolean | null>(null)
    const [auditoryShaking, setAuditoryShaking] = useState(false)
    const [currentAuditoryWordIndex, setCurrentAuditoryWordIndex] = useState(0)

    const [selectedBingoCard, setSelectedBingoCard] = useState(0)
    const [bingoCellColors, setBingoCellColors] = useState<string[][]>([])
    const [lastClickTime, setLastClickTime] = useState<{ [key: string]: number }>({})

    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

    const currentCategory = GAME_CATEGORIES[selectedCategoryIndex]
    const currentGame = currentCategory.games[selectedGameIndex]
    const gameType = currentGame.gameType || (currentGame.isStory ? "story" : "wordBuilding")

    // Word building game state
    const currentWordData = gameType === "wordBuilding" && currentGame.words ? currentGame.words[selectedWordIndex] : null
    const correctWord = currentWordData?.word || ""

    const [availableLetters, setAvailableLetters] = useState<Letter[]>([])
    const [droppedLetters, setDroppedLetters] = useState<(Letter | null)[]>([])
    const [lockedSlots, setLockedSlots] = useState<boolean[]>([])
    const [draggedLetter, setDraggedLetter] = useState<Letter | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [isShaking, setIsShaking] = useState(false)
    const [showSuccessPopup, setShowSuccessPopup] = useState(false)

    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    useEffect(() => {
        if (gameType === "auditoryProcessing" && currentGame.auditoryProcessing) {
        const letters = currentGame.auditoryProcessing.letters.map((letter, index) => ({
            id: `${letter}-${index}`,
            letter: letter.toLowerCase(),
            originalIndex: index,
        }))
        setAuditoryLetters(letters)
        setAuditoryDropped([null, null, null])
        setAuditoryCorrect(null)
        setAuditoryShaking(false)
        setCurrentAuditoryWordIndex(0)
        }
    }, [selectedCategoryIndex, selectedGameIndex, gameType, currentGame])

    useEffect(() => {
        if (gameType === "soundBingo" && currentGame.soundBingo) {
        const card = currentGame.soundBingo.cards[selectedBingoCard]
        const colors = card.grid.map((row) => row.map(() => "bg-white"))
        setBingoCellColors(colors)
        setLastClickTime({})
        }
    }, [selectedCategoryIndex, selectedGameIndex, selectedBingoCard, gameType, currentGame])

    useEffect(() => {
        if (gameType === "wordBuilding" && currentGame.words) {
        const wordData = currentGame.words[selectedWordIndex]
        setAvailableLetters(shuffleArray([...wordData.letters]))
        setDroppedLetters(Array(wordData.word.length).fill(null))
        setLockedSlots(Array(wordData.word.length).fill(false))
        setIsCorrect(null)
        setIsShaking(false)
        setShowSuccessPopup(false)
        setDraggedLetter(null)
        }
    }, [selectedCategoryIndex, selectedGameIndex, selectedWordIndex, gameType, currentGame])

    useEffect(() => {
        if (gameType === "story") {
        setCurrentSentenceIndex(0)
        setShowSuccessAnimation(false)
        }
    }, [selectedCategoryIndex, selectedGameIndex, gameType])

    const checkPartialWord = (letters: (Letter | null)[]) => {
        for (let i = 0; i < letters.length; i++) {
        if (letters[i] !== null) {
            if (letters[i]!.letter !== correctWord[i]) {
            return false
            }
        }
        }
        return true
    }

    const handleDragStart = (letter: Letter) => {
        setDraggedLetter(letter)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDropOnSlot = (slotIndex: number) => {
        if (!draggedLetter) return

        // Don't allow dropping on locked slots
        if (lockedSlots[slotIndex]) return

        // Check if this letter is correct for this specific slot
        const isCorrectForSlot = draggedLetter.letter === correctWord[slotIndex]

        if (isCorrectForSlot) {
        // Correct letter - place it and lock it
        setAvailableLetters((prev) => prev.filter((l) => l.id !== draggedLetter.id))

        const newDroppedLetters = [...droppedLetters]
        newDroppedLetters[slotIndex] = draggedLetter
        setDroppedLetters(newDroppedLetters)

        const newLockedSlots = [...lockedSlots]
        newLockedSlots[slotIndex] = true
        setLockedSlots(newLockedSlots)

        setDraggedLetter(null)

        // Check if all slots are filled correctly
        if (newDroppedLetters.every((l, i) => l !== null && l.letter === correctWord[i])) {
            setIsCorrect(true)
            setTimeout(() => {
            setShowSuccessPopup(true)
            }, 300)
        }
        } else {
        // Wrong letter - show error and don't place it
        setIsCorrect(false)
        setIsShaking(true)

        setTimeout(() => {
            setIsCorrect(null)
            setIsShaking(false)
            setDraggedLetter(null)
        }, 600)
        }
    }

    const handleTouchStart = (letter: Letter) => {
        setDraggedLetter(letter)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault()
    }

    const handleTouchEnd = (e: React.TouchEvent, slotIndex: number) => {
        if (!draggedLetter) return
        handleDropOnSlot(slotIndex)
    }

    const handleAuditoryDragStart = (letter: Letter) => {
        setAuditoryDragged(letter)
    }

    const handleAuditoryDropOnSlot = (slotIndex: number) => {
        if (!auditoryDragged || !currentGame.auditoryProcessing) return

        const newDropped = [...auditoryDropped]

        // If slot already has a letter, return it to available letters
        if (newDropped[slotIndex]) {
        setAuditoryLetters((prev) => [...prev, newDropped[slotIndex]!])
        }

        // Remove dragged letter from available and place in slot
        setAuditoryLetters((prev) => prev.filter((l) => l.id !== auditoryDragged.id))
        newDropped[slotIndex] = auditoryDragged
        setAuditoryDropped(newDropped)
        setAuditoryDragged(null)

        if (newDropped.every((l) => l !== null)) {
        const formedWord = newDropped.map((l) => l!.letter.toLowerCase()).join("")
        const isCorrectWord = currentGame.auditoryProcessing.correctWords.includes(formedWord)

        if (isCorrectWord) {
            setAuditoryCorrect(true)
            setTimeout(() => {
            // Reset for next word
            const letters = currentGame.auditoryProcessing!.letters.map((letter, index) => ({
                id: `${letter}-${index}-${Date.now()}`,
                letter: letter.toLowerCase(),
                originalIndex: index,
            }))
            setAuditoryLetters(letters)
            setAuditoryDropped([null, null, null])
            setAuditoryCorrect(null)
            setCurrentAuditoryWordIndex((prev) => prev + 1)
            }, 1500)
        } else {
            setAuditoryCorrect(false)
            setAuditoryShaking(true)
            setTimeout(() => {
            // Return letters to available
            const letters = currentGame.auditoryProcessing!.letters.map((letter, index) => ({
                id: `${letter}-${index}-${Date.now()}`,
                letter: letter.toLowerCase(),
                originalIndex: index,
            }))
            setAuditoryLetters(letters)
            setAuditoryDropped([null, null, null])
            setAuditoryCorrect(null)
            setAuditoryShaking(false)
            }, 600)
        }
        }
    }

    const handleBingoCellClick = (rowIndex: number, colIndex: number) => {
        const cellKey = `${rowIndex}-${colIndex}`
        const now = Date.now()
        const lastClick = lastClickTime[cellKey] || 0
        const isDoubleClick = now - lastClick < 300

        setBingoCellColors((prev) => {
        const newColors = prev.map((row) => [...row])
        const currentColor = newColors[rowIndex][colIndex]

        if (isDoubleClick) {
            // Double click - turn green
            newColors[rowIndex][colIndex] = "bg-green-400"
        } else {
            // Single click - toggle blue on/off
            if (currentColor === "bg-blue-400") {
            newColors[rowIndex][colIndex] = "bg-white"
            } else {
            newColors[rowIndex][colIndex] = "bg-blue-400"
            }
        }
        return newColors
        })

        setLastClickTime((prev) => ({ ...prev, [cellKey]: now }))
    }

    const handleBingoCellRightClick = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
        e.preventDefault()
        setBingoCellColors((prev) => {
        const newColors = prev.map((row) => [...row])
        newColors[rowIndex][colIndex] = "bg-red-400"
        return newColors
        })
    }

    const handleResetBingoCard = () => {
        if (currentGame.soundBingo) {
        const card = currentGame.soundBingo.cards[selectedBingoCard]
        const colors = card.grid.map((row) => row.map(() => "bg-white"))
        setBingoCellColors(colors)
        setLastClickTime({})
        }
    }

    const getBorderColor = () => {
        if (isCorrect === true) return "border-success"
        if (isCorrect === false) return "border-error"

        const hasLetters = droppedLetters.some((l) => l !== null)
        if (hasLetters && !checkPartialWord(droppedLetters)) {
        return "border-error"
        }

        return "border-primary/30"
    }

    const resetGame = () => {
        setShowSuccessPopup(false)
    }

    const handleGameChange = (categoryIndex: number, gameIndex: number) => {
        setSelectedCategoryIndex(categoryIndex)
        setSelectedGameIndex(gameIndex)
        setSelectedWordIndex(0)
        setSelectedBingoCard(0)
    }

    const handlePreviousWord = () => {
        if (selectedWordIndex > 0) {
        setSelectedWordIndex(selectedWordIndex - 1)
        }
    }

    const handleNextWord = () => {
        if (currentGame.words && selectedWordIndex < currentGame.words.length - 1) {
        setSelectedWordIndex(selectedWordIndex + 1)
        }
    }

    const toggleCategory = (categoryIndex: number) => {
        setExpandedCategories((prev) =>
        prev.includes(categoryIndex) ? prev.filter((i) => i !== categoryIndex) : [...prev, categoryIndex],
        )
    }

    const getLetterColors = () => {
        const colorSets = [
        [
            "bg-secondary text-secondary-foreground",
            "bg-accent text-accent-foreground",
            "bg-tertiary text-tertiary-foreground",
        ],
        [
            "bg-tertiary text-tertiary-foreground",
            "bg-secondary text-secondary-foreground",
            "bg-accent text-accent-foreground",
        ],
        [
            "bg-accent text-accent-foreground",
            "bg-tertiary text-tertiary-foreground",
            "bg-secondary text-secondary-foreground",
        ],
        ]

        const baseColors = colorSets[selectedWordIndex % 3]

        if (correctWord.length === 4) {
        return [...baseColors, "bg-primary text-primary-foreground"]
        }

        return baseColors
    }

    const handlePreviousSentence = () => {
        if (currentSentenceIndex > 0) {
        setCurrentSentenceIndex(currentSentenceIndex - 1)
        setShowSuccessAnimation(false)
        }
    }

    const handleNextSentence = () => {
        if (!currentGame.story) return

        if (currentSentenceIndex < currentGame.story.sentences.length - 1) {
        setCurrentSentenceIndex(currentSentenceIndex + 1)
        setShowSuccessAnimation(false)
        } else {
        setShowSuccessAnimation(true)
        setTimeout(() => {
            setShowSuccessAnimation(false)
        }, 2000)
        }
    }

    const handleResetStory = () => {
        setCurrentSentenceIndex(0)
        setShowSuccessAnimation(false)
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-background via-accent/20 to-tertiary/30">
        <aside
            className={`${
            sidebarOpen ? "w-64" : "w-0"
            } bg-card border-r border-border transition-all duration-300 overflow-hidden flex-shrink-0`}
        >
            <div className="p-6 overflow-y-auto h-full">
            <h2 className="text-2xl font-bold text-foreground mb-6">Learning Games</h2>
            <nav className="space-y-4">
                {GAME_CATEGORIES.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                    <button
                    onClick={() => toggleCategory(categoryIndex)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-all font-semibold text-foreground"
                    >
                    <span>{category.name}</span>
                    {expandedCategories.includes(categoryIndex) ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                    </button>
                    {expandedCategories.includes(categoryIndex) && (
                    <div className="mt-2 space-y-2 pl-2">
                        {category.games.map((game, gameIndex) => (
                        <button
                            key={gameIndex}
                            onClick={() => handleGameChange(categoryIndex, gameIndex)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm ${
                            selectedCategoryIndex === categoryIndex && selectedGameIndex === gameIndex
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "hover:bg-muted text-foreground/80"
                            }`}
                        >
                            {game.name}
                        </button>
                        ))}
                    </div>
                    )}
                </div>
                ))}
            </nav>
            </div>
        </aside>

        <main className="flex-1 flex flex-col p-4">
            <div className="mb-4">
            <Link href={ROUTES.DASHBOARD}>
                <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
                </Button>
            </Link>
            </div>
            
            <div className="w-full flex justify-center">
            {gameType === "auditoryProcessing" && currentGame.auditoryProcessing && (
            <div className="w-full max-w-2xl">
                <div className="flex justify-center mb-4">
                    <OpenAnswerKeyButton gameName={currentGame.name} />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 text-foreground text-balance">
                {currentGame.name}
                </h1>
                <p className="text-center mb-6 text-xl md:text-2xl text-foreground/80 font-medium">Build a 3-letter word</p>

                <Card
                className={`p-8 md:p-12 mb-12 transition-all duration-300 border-4 ${
                    auditoryCorrect === true
                    ? "bg-success/20 border-success shadow-2xl shadow-success/30 scale-105"
                    : auditoryCorrect === false && auditoryShaking
                        ? "bg-error/20 border-error"
                        : "bg-card shadow-xl border-primary/30"
                } ${auditoryShaking ? "animate-shake" : ""}`}
                >
                <div className="flex justify-center gap-3 md:gap-6 mb-8">
                    {auditoryDropped.map((letter, index) => (
                    <div
                        key={index}
                        onDragOver={handleDragOver}
                        onDrop={() => handleAuditoryDropOnSlot(index)}
                        className={`w-20 h-24 md:w-28 md:h-32 rounded-3xl border-4 border-dashed flex items-center justify-center text-5xl md:text-7xl font-bold transition-all ${
                        letter
                            ? auditoryCorrect === true
                            ? "bg-success/30 border-success text-success-foreground scale-110"
                            : auditoryCorrect === false && auditoryShaking
                                ? "bg-error/30 border-error text-error-foreground"
                                : "bg-primary/20 border-primary text-primary"
                            : "border-muted-foreground/40 bg-muted/20 hover:bg-muted/40 hover:border-primary/50"
                        }`}
                    >
                        {letter?.letter}
                    </div>
                    ))}
                </div>

                {auditoryCorrect === true && (
                    <div className="text-center animate-bounce">
                    <p className="text-3xl md:text-4xl font-bold text-success mb-2">Correct!</p>
                    </div>
                )}

                {auditoryCorrect === false && (
                    <div className="text-center">
                    <p className="text-3xl md:text-4xl font-bold text-error mb-2">Try again!</p>
                    </div>
                )}
                </Card>

                <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-md mx-auto">
                {auditoryLetters.map((letter) => (
                    <div
                    key={letter.id}
                    draggable
                    onDragStart={() => handleAuditoryDragStart(letter)}
                    className="w-full aspect-square bg-secondary text-secondary-foreground rounded-3xl shadow-xl flex items-center justify-center text-4xl md:text-6xl font-bold cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-all duration-200 touch-none select-none"
                    style={{
                        boxShadow: "0 10px 0 0 rgba(0,0,0,0.15)",
                    }}
                    >
                    {letter.letter}
                    </div>
                ))}
                </div>

                <p className="text-center mt-8 text-lg md:text-xl text-foreground/70 font-medium">
                Words completed: {currentAuditoryWordIndex}
                </p>
            </div>
            )}

            {gameType === "wordList" && currentGame.wordList && (
            <div className="w-full max-w-4xl">
                <WordListSlideshow
                title={currentGame.name}
                words={currentGame.wordList}
                rightAction={
                    <div className="hidden md:block">
                    {/* Optional: open the teacher answer key in a new tab, reuse your existing button */}
                    <OpenAnswerKeyButton gameName={currentGame.name} />
                    </div>
                }
                />
            </div>
            )}

            {gameType === "soundBingo" && currentGame.soundBingo && (
            <div className="w-full max-w-lg">
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 text-foreground text-balance">
                {currentGame.name} Sound Bingo
                </h1>

                <div className="flex justify-center gap-4 mb-6">
                {currentGame.soundBingo.cards.map((_, index) => (
                    <button
                    key={index}
                    onClick={() => setSelectedBingoCard(index)}
                    className={`px-6 py-3 rounded-xl text-xl font-bold transition-all ${
                        selectedBingoCard === index
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                    >
                    Card {index + 1}
                    </button>
                ))}
                </div>

                <Card className="p-8 bg-card shadow-xl border-4 border-primary/30 mb-6">
                <div className="grid grid-rows-5 gap-2">
                    {currentGame.soundBingo.cards[selectedBingoCard].grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-4 gap-2">
                        {row.map((letter, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => handleBingoCellClick(rowIndex, colIndex)}
                            onContextMenu={(e) => handleBingoCellRightClick(e, rowIndex, colIndex)}
                            className={`aspect-square ${
                            bingoCellColors[rowIndex]?.[colIndex] || "bg-white"
                            } border-4 border-gray-800 rounded-xl flex items-center justify-center text-4xl md:text-6xl font-bold cursor-pointer hover:scale-120 active:scale-95 transition-all shadow-lg select-none`}
                        >
                            {letter.toLowerCase()}
                        </div>
                        ))}
                    </div>
                    ))}
                </div>
                </Card>

                <div className="flex justify-center gap-4">
                <button
                    onClick={handleResetBingoCard}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-2xl text-xl md:text-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                >
                    <RotateCcw className="w-6 h-6" />
                    Reset Card
                </button>
                </div>

                <div className="mt-6 text-center space-y-2">
                <p className="text-lg text-foreground/70">
                    <strong>Single click:</strong> Blue | <strong>Double click:</strong> Green |{" "}
                    <strong>Right click:</strong> Red
                </p>
                </div>
            </div>
            )}

            {gameType === "story" && (
            <div className="w-full max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-foreground text-balance">
                {currentGame.name}
                </h1>

                <div className="flex flex-col gap-8 items-center">
                {/* Story Image - Now on top */}
                <div className="w-full max-w-2xl flex justify-center">
                    {currentGame.story?.images?.[currentSentenceIndex] ? (
                        <img
                            src={currentGame.story.images[currentSentenceIndex]}
                            alt={`Sentence ${currentSentenceIndex + 1}`}
                            className="h-80 w-80 rounded-3xl shadow-2xl border-4 border-primary"
                        />
                    ) : (
                        <div className="w-full aspect-[4/3] rounded-3xl shadow-2xl border-4 border-primary bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground text-xl">Image Placeholder</p>
                        </div>
                    )}
                </div>
                {/* Story Text Area - Now below image */}
                <div className="w-full max-w-2xl">
                    <Card className="p-8 md:p-12 bg-card shadow-xl border-4 border-primary/30 min-h-[200px] flex flex-col justify-between">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                        <p className="text-3xl md:text-5xl font-bold text-foreground leading-relaxed">
                            {currentGame.story?.sentences[currentSentenceIndex]}
                        </p>
                        </div>
                    </div>

                    {/* Success Animation */}
                    {showSuccessAnimation && (
                        <div className="text-center mt-6 animate-bounce">
                        <Sparkles className="w-16 h-16 mx-auto text-success mb-2" />
                        <p className="text-3xl font-bold text-success">Great Reading!</p>
                        </div>
                    )}
                    </Card>

                    {/* Story Controls */}
                    <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    <button
                        onClick={handlePreviousSentence}
                        disabled={currentSentenceIndex === 0}
                        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 rounded-2xl text-xl md:text-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                    >
                        <ChevronLeft className="w-6 h-6" />
                        Previous
                    </button>

                    <button
                        onClick={handleResetStory}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-2xl text-xl md:text-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                    >
                        <RotateCcw className="w-6 h-6" />
                        Reset
                    </button>

                    <button
                        onClick={handleNextSentence}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl text-xl md:text-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                    >
                        Next
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    </div>

                    {/* Sentence Progress */}
                    {currentGame.story && (
                    <p className="text-center mt-6 text-xl font-semibold text-foreground/70">
                        Sentence {currentSentenceIndex + 1} of {currentGame.story.sentences.length}
                    </p>
                    )}
                </div>
                </div>
            </div>
            )}

            {gameType === "wordBuilding" && (
            <div className="w-full max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 text-foreground text-balance">
                {currentGame.name}
                </h1>

                <p className="text-center mb-6 text-xl md:text-2xl text-foreground/80 font-medium">
                Drag the letters to make {correctWord}
                </p>

                <div className="flex items-center justify-center gap-4 mb-6">
                <button
                    onClick={handlePreviousWord}
                    disabled={selectedWordIndex === 0}
                    className="p-2 rounded-lg bg-card border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-lg font-semibold text-foreground">
                    Word {selectedWordIndex + 1} of {currentGame.words?.length || 0}
                </span>
                <button
                    onClick={handleNextWord}
                    disabled={!currentGame.words || selectedWordIndex === currentGame.words.length - 1}
                    className="p-2 rounded-lg bg-card border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
                </div>

                <Card
                className={`p-8 md:p-12 mb-12 transition-all duration-300 border-4 ${
                    isCorrect === true
                    ? "bg-success/20 border-success shadow-2xl shadow-success/30 scale-105"
                    : isCorrect === false && isShaking
                        ? "bg-error/20 border-error"
                        : "bg-card shadow-xl"
                } ${getBorderColor()} ${isShaking ? "animate-shake" : ""}`}
                >
                <div className="flex justify-center gap-3 md:gap-6">
                    {droppedLetters.map((letter, index) => {
                    const isSlotWrong = letter !== null && letter.letter !== correctWord[index]
                    const isLocked = lockedSlots[index]

                    return (
                        <div
                        key={index}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDropOnSlot(index)}
                        onTouchEnd={(e) => handleTouchEnd(e, index)}
                        className={`w-20 h-24 md:w-28 md:h-32 rounded-3xl border-4 border-dashed flex items-center justify-center text-5xl md:text-7xl font-bold transition-all ${
                            letter
                            ? isCorrect === true
                                ? "bg-success/30 border-success text-success-foreground scale-110"
                                : isLocked
                                ? "bg-primary/30 border-primary text-primary ring-4 ring-primary/50"
                                : isSlotWrong || (isCorrect === false && isShaking)
                                    ? "bg-error/30 border-error text-error-foreground"
                                    : "bg-primary/20 border-primary text-primary"
                            : "border-muted-foreground/40 bg-muted/20 hover:bg-muted/40 hover:border-primary/50"
                        } ${isLocked ? "cursor-not-allowed" : ""}`}
                        >
                        {letter?.letter}
                        </div>
                    )
                    })}
                </div>

                {isCorrect === true && (
                    <div className="text-center mt-8 animate-bounce">
                    <p className="text-3xl md:text-4xl font-bold text-success mb-2">Amazing!</p>
                    <p className="text-xl md:text-2xl text-success-foreground/80">You spelled {correctWord}!</p>
                    </div>
                )}
                </Card>

                <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
                {availableLetters.map((letter) => {
                    const colors = getLetterColors()

                    return (
                    <div
                        key={letter.id}
                        draggable
                        onDragStart={() => handleDragStart(letter)}
                        onTouchStart={() => handleTouchStart(letter)}
                        onTouchMove={handleTouchMove}
                        className={`w-20 h-24 md:w-28 md:h-32 ${colors[letter.originalIndex]} rounded-3xl shadow-xl flex items-center justify-center text-5xl md:text-7xl font-bold cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-all duration-200 touch-none select-none`}
                        style={{
                        boxShadow: "0 10px 0 0 rgba(0,0,0,0.15)",
                        }}
                    >
                        {letter.letter}
                    </div>
                    )
                })}
                </div>

                <p className="text-center mt-12 text-lg md:text-xl text-foreground/70 font-medium">
                Pick a letter and drop it in a box!
                </p>
            </div>
            )}
            </div>
        </main>

        {showSuccessPopup && currentWordData && (
            <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn"
            onClick={resetGame}
            >
            <div
                className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-md mx-4 animate-popIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Great Job!</h2>
                {currentWordData.imagePlaceholder ? (
                    <img
                    src={currentWordData.imagePlaceholder || "/placeholder.svg"}
                    alt={`Happy ${correctWord}`}
                    className="w-full h-64 object-cover rounded-2xl mb-6"
                    />
                ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-2xl mb-6 flex items-center justify-center">
                    <p className="text-gray-500">Image Placeholder</p>
                    </div>
                )}
                <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-6">You spelled {correctWord}!</p>
                <div className="flex gap-4 justify-center">
                    <button
                    onClick={resetGame}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-2xl text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                    Try Again
                    </button>
                    {currentGame.words && selectedWordIndex < currentGame.words.length - 1 && (
                    <button
                        onClick={() => {
                        setShowSuccessPopup(false)
                        handleNextWord()
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-2xl text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                        Next Word
                    </button>
                    )}
                </div>
                </div>
            </div>
            </div>
        )}

        <style>{`
            @keyframes shake {
            0%,
            100% {
                transform: translateX(0);
            }
            10%,
            30%,
            50%,
            70%,
            90% {
                transform: translateX(-10px);
            }
            20%,
            40%,
            60%,
            80% {
                transform: translateX(10px);
            }
            }
            .animate-shake {
            animation: shake 0.6s ease-in-out;
            }
            @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
            }
            @keyframes popIn {
            0% {
                transform: scale(0.5);
                opacity: 0;
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
            }
            .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
            }
            .animate-popIn {
            animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
        `}</style>
        </div>
    )
}
