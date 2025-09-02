import { FC } from 'react'

interface QuestionAnswersProps {
  question: string
  answer: string
}

const QuestionAnswers: FC<QuestionAnswersProps> = ({ question, answer }) => {
  return <div>QuestionAnswers</div>
}

export default QuestionAnswers
