'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type CardData = {
  title: string
  status: boolean[]
}

type Cards = {
  [key: string]: CardData
}

export default function Home() {
  const initCards: Cards = {
    trapA: { title: '🐍', status: [false, false, false] },
    trapB: { title: '🕷️', status: [false, false, false] },
    trapC: { title: '🔥', status: [false, false, false] },
    trapD: { title: '🪨', status: [false, false, false] },
    trapE: { title: '🧟‍♂️', status: [false, false, false] }
  }

  const [trapCards, setTrapCards] = useState<Cards>(initCards)
  const [otherCards, setOtherCards] = useState<number>(15)

  const updateTrapCardStatus = (cardName: keyof Cards, type: string) => {
    const updatedCards = { ...trapCards }
    const cardIndexes = updatedCards[cardName].status

    if (type === 'plus') {
      const index = cardIndexes.indexOf(false)
      if (index !== -1) {
        cardIndexes[index] = true
      }
    } else if (type === 'minus') {
      const index = cardIndexes.lastIndexOf(true)
      if (index !== -1) {
        cardIndexes[index] = false
      }
    }

    setTrapCards(updatedCards)
  }

  const handleOtherCardsChange = (type: string) => {
    if (type === 'plus' && otherCards > 0) {
      setOtherCards(otherCards - 1)
    } else if (type === 'minus' && otherCards < 15) {
      setOtherCards(otherCards + 1)
    }
  }

  const getRemainingTrapCards = () => {
    const remaining: { cardName: string; index: number }[] = []
    Object.entries(trapCards).forEach(([cardName, cardData]) => {
      cardData.status.forEach((checked, index) => {
        if (!checked) {
          remaining.push({ cardName, index })
        }
      })
    })
    return remaining
  }

  const calculateProbabilities = (
    remainingCards: { cardName: string; index: number }[]
  ) => {
    const total = remainingCards.length + otherCards
    const probabilities: { [key: string]: number } = {}

    remainingCards.forEach(({ cardName }) => {
      probabilities[cardName] = (probabilities[cardName] || 0) + 1 / total
    })

    probabilities['otherCards'] = otherCards / total
    return probabilities
  }

  const countFalse = (array: boolean[]) =>
    array.filter((value) => !value).length

  const remainingTrapCards = getRemainingTrapCards()
  const probabilities = calculateProbabilities(remainingTrapCards)
  const totalCards = remainingTrapCards.length + otherCards
  const trapCardsProbability = remainingTrapCards.length / totalCards

  return (
    <div className={'p-5 '}>
      <h1 className={'text-3xl font-bold mb-5'}>Incan Gold Assistant</h1>
      <div className={'grid grid-cols-[1fr_3fr] gap-4 bg-slate-50'}>
        <div className={'grid grid-rows-5 gap-4'}>
          {Object.entries(trapCards).map(([cardName, cardData], index) => (
            <Card key={`${cardName}-${index}`}>
              <CardHeader>
                <CardTitle className={'text-5xl flex gap-4'}>
                  {cardData.title}
                  <div className={'flex gap-2 items-center'}>
                    <Button
                      variant="outline"
                      size="icon"
                      className={'h-5'}
                      onClick={() =>
                        updateTrapCardStatus(cardName as keyof Cards, 'minus')
                      }
                    >
                      -
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className={'h-5'}
                      onClick={() =>
                        updateTrapCardStatus(cardName as keyof Cards, 'plus')
                      }
                    >
                      +
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Remaining: {countFalse(cardData.status)}</p>
                <p>
                  Probabilities: {(probabilities[cardName] * 100).toFixed(2)}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className={'grid grid-cols-1 gap-4'}>
          <Card>
            <CardHeader>
              <CardTitle>Other Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Count: {otherCards}</p>
            </CardContent>
            <CardFooter className={'gap-2'}>
              <Button
                variant="outline"
                size="icon"
                className={'h-5'}
                onClick={() => handleOtherCardsChange('minus')}
              >
                -
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={'h-5'}
                onClick={() => handleOtherCardsChange('plus')}
              >
                +
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>

            <CardContent>
              <p>Total trapCards: {remainingTrapCards.length}</p>
              <p>Total otherCards: {otherCards}</p>
              <p>Total cards: {totalCards}</p>
              <p>
                Probability of any trapCard:{' '}
                {(trapCardsProbability * 100).toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
