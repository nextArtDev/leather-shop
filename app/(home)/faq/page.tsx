// import { PhoneCall } from 'lucide-react'
// import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
// import { Button } from '@/components/ui/button'

const faqs = [
  {
    id: '1',
    question: ' چرم مورد استفاده شما از چه نوعی است و منشأ آن کجاست؟',
    answer:
      'تمامی محصولات ما از چرم طبیعی گاو با بالاترین کیفیت و منشأ ایرانی (دباغی‌های معتبر اصفهان و تبریز) تهیه می‌شود. ما از چرم‌های مصنوعی (پلاستیکی) استفاده نمی‌کنیم.',
  },
  {
    id: '2',
    question: 'چگونه از طبیعی و اصل بودن چرم مطمئن شوم؟',
    answer:
      'چرم طبیعی دارای رگه‌ها، بافت و بوئی منحصر به فرد است که در چرم مصنوعی وجود ندارد. با گذشت زمان و استفاده، چرم طبیعی نرم‌تر و زیباتر می‌شود و پاتینا (جلای کهنه‌گی) می‌گیرد.',
  },
  {
    id: '3',
    question: 'آیا رنگ چرم ثابت است و روی لباس نمی‌ریزد؟',
    answer:
      'بله. از رنگ‌های باکیفیت و ثابت‌کننده‌های حرفه‌ای استفاده می‌کنیم. اما برای اطمینان بیشتر در اولین استفاده، توصیه می‌کنیم آن را با یک پارچه سفید و مرطوب به آرامی تماس دهید تا باقی‌مانده رنگ احتمالی پاک شود.',
  },
  {
    id: '4',
    question: ' آیا محصولات شما کاملاً دست‌ساز هستند؟',
    answer:
      'بله، تمام مراحل برش، دوخت (با دست یا چرخ خیاطی صنعتی)، رنگ‌آمیزی و پرداخت توسط هنرمندان ما به صورت دستی انجام می‌گیرد. این باعث می‌شود هر محصول منحصر به فرد و دارای هویتی خاص باشد',
  },
  {
    id: '5',
    question: 'چگونه می‌توانم اندازه صحیح کیف یا کفش خود را انتخاب کنم؟',
    answer:
      'در صفحه هر محصول، یک راهنمای اندازه‌گیری دقیق (بر حسب سانتیمتر) قرار داده شده است. لطفاً قبل از خرید، با استفاده از یک خطکش یا متر، اندازه مورد نیاز خود را مطابق با راهنما کنترل کنید.',
  },
  {
    id: '6',
    question: 'چگونه از محصولات چرمی خود نگهداری کنم؟',
    answer:
      '    از تماس طولانی‌مدت با آب و نور مستقیم خورشید خودداری کنید. برای تمیز کردن از یک پارچه نرم و خشک استفاده کنید. هر ۶ تا ۱۲ ماه یکبار با استفاده از مغز چرم (Leather Conditioner) محصول خود را تغذیه کنید تا نرمی و انعطاف آن حفظ شود. هنگامی که از محصول استفاده نمی‌کنید، آن را درون کیسه پارچه‌ای خود (دماری) قرار داده و در جای خشک و خنک نگهداری کنید.',
  },
]
const FaqPage = () => (
  <div className="w-full py-20 lg:py-40 overflow-x-hidden">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          {/* <Badge variant="outline">سوالات پرتکرار</Badge> */}
          <div className="flex gap-2 flex-col">
            <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
              سوالات متداول (پرسش و پاسخ)
            </h4>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              عزیزان و همراهان گرامی، در این صفحه به پرتکرارترین سوالاتی که ممکن
              است درباره محصولات چرم دست‌ساز، فرآیند خرید و نگهداری از آنها
              داشته باشید، پاسخ داده‌ایم. اگر پاسخ پرسش خود را نیافتید، از طریق
              راه‌های ارتباطی با ما در تماس باشید. خوشحال می‌شویم به شما کمک
              کنیم.
            </p>
          </div>
          {/* <div>
            <Button className="gap-4" variant="outline">
              Any questions? Reach out <PhoneCall className="w-4 h-4" />
            </Button>
          </div> */}
        </div>

        <div className="max-w-3xl w-full ">
          <Accordion type="single" collapsible className="w-full mx-4">
            {faqs.map((q, index) => (
              <AccordionItem key={index} value={'index-' + index}>
                <AccordionTrigger className="text-md md:text-lg">
                  {q.question}
                </AccordionTrigger>
                <AccordionContent className="text-md md:text-lg">
                  {q.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  </div>
)

export default FaqPage
