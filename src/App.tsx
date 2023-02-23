import { useState, useEffect } from 'react'
import bgDesktop from './assets/images/bg-main-desktop.png'
import bgMobile from './assets/images/bg-main-mobile.png'
import CardFront from './assets/images/bg-card-front.png'
import CardBack from './assets/images/bg-card-back.png'
import CardLogo from './assets/images/card-logo.svg'
import CompleteIcon from './assets/images/icon-complete.svg'
import './App.css'

interface formData {
  cardName: string,
  cardNumber: string,
  expMonth: string,
  expYear: string,
  cvc: string,
}

interface formValidate {
  cardName: validate | null,
  cardNumber: validate | null,
  expMonth: validate | null,
  expYear: validate | null,
  cvc: validate | null,
}

interface validate {
  status: boolean;
  text: string;
}

type Field = 'cardName' | 'cardNumber' | 'expMonth' | 'expYear' | 'cvc';

function App() {

  const [form, setForm] = useState<formData>({
    cardName: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  });

  const [validate, setValidate] = useState<formValidate>({
    cardName: null,
    cardNumber: null,
    expMonth: null,
    expYear: null,
    cvc: null,
  });

  const [submitStatus, setSubmitStatus] = useState<boolean>(false);

  const handleFormChange = (evt: any) => {

    var field: string = evt.target.id;
    var vl: string = evt.target.value;
    var validateData: boolean = false;
    var validateText: string = "";

    if (field === "cardNumber") {

      let pureNumber: string = vl.replace(/\s/g, '')
      if (pureNumber.length > 16) {
        return
      }

      if (!containsOnlyNumbers(pureNumber)) {
        validateData = true;
        validateText = "Wrong format, numbers only"
      }

      if (vl < form?.cardNumber) {
        //decrease
        if (pureNumber.length % 4 === 0) {
          vl = vl.substring(0, vl.length - 1)
        }
      } else {
        //increase
        if (pureNumber.length < 4) {
          vl = pureNumber.substring(0, 4)
        } else if (pureNumber.length < 8) {
          vl = pureNumber.substring(0, 4) + " " + pureNumber.substring(4, 8)
        } else if (pureNumber.length < 12) {
          vl = pureNumber.substring(0, 4) + " " + pureNumber.substring(4, 8) + " " + pureNumber.substring(8, 12)
        } else if (pureNumber.length < 16) {
          vl = pureNumber.substring(0, 4) + " " + pureNumber.substring(4, 8) + " " + pureNumber.substring(8, 12) + " " + pureNumber.substring(12, 16)
        }
      }
      evt.target.setSelectionRange(vl.length, vl.length);
    }

    if (field === "expMonth" || field === "expYear") {
      if (vl.length > 2) {
        return
      }
    }

    if (field === "cvc") {
      if (vl.length > 3) {
        return
      }
    }

    if (vl === "") {
      validateData = true;
      validateText = "Can't be blank"
    }

    setForm((formSearch: formData) => ({
      ...formSearch,
      [field]: vl,
    }));

    setValidate((validate: formValidate) => ({
      ...validate,
      [field]: {
        status: validateData,
        text: validateText
      },
    }));

  }

  const handleSubmit = (evt: any) => {
    var status = ValidateAllData();
    if (ValidateAllData()) {
      setSubmitStatus(true);
    }
  }

  const handleContinue = (evt: any) => {
    clearAllData();
    setSubmitStatus(false);
  }

  const upperCaseTransform = (str: string) => {
    return str.toUpperCase();
  }

  function clearAllData() {
    setForm({
      cardName: "",
      cardNumber: "",
      expMonth: "",
      expYear: "",
      cvc: "",
    });
    setValidate({
      cardName: null,
      cardNumber: null,
      expMonth: null,
      expYear: null,
      cvc: null,
    });
  }

  function containsOnlyNumbers(str: string) {
    return /^\d+$/.test(str);
  }

  function ValidateAllData() {

    var validateBuffer = validate;

    for (let field in validateBuffer) {
      var fieldName: Field = field as Field;
      var statusError: boolean = false;
      var statusText: string = "";

      if (fieldName === "cardNumber" && form[fieldName].replace(/\s/g, '').length !== 16) {
        statusError = true;
        statusText = "Digit not 16"
      }

      if (fieldName === "cardNumber" && !containsOnlyNumbers(form[fieldName].replace(/\s/g, ''))) {
        statusError = true;
        statusText = "Wrong format, numbers only"
      }

      if (form[fieldName] === "") {
        statusError = true;
        statusText = "Can't be blank"
      }

      if (!validate[fieldName] || statusError) {
        validateBuffer[fieldName] = {
          status: statusError,
          text: statusText
        }
      }
    }

    if (validate?.cardName?.status || validate?.cardNumber?.status || validate?.cvc?.status || validate?.expMonth?.status || validate?.expYear?.status) {
      setValidate((validate: formValidate) => ({
        ...validate,
        validateBuffer
      }));

      return false;
    }

    return true

  }

  return (
    <div className='overflow-x-hidden'>
      <div className='hidden md:flex md:items-center md:absolute' style={{ backgroundImage: `url(${bgDesktop})`, backgroundRepeat: "no-repeat", backgroundSize: "100% 100%", height: "100vh", width: "30%", zIndex: -1 }} />
      <div className='md:hidden flex items-center absolute' style={{ backgroundImage: `url(${bgMobile})`, backgroundRepeat: "no-repeat", backgroundSize: "100% 100%", height: "30vh", width: "100%", zIndex: -1 }} />
      <div className='flex flex-col md:flex-row md:justify-evenly place-items-center min-w-[320px] min-h-[100vh]'>
        {/* desktop */}
        <div className='hidden md:block'>
          <div className='flex rounded-xl p-8 ml-[-50px]' style={{ backgroundImage: `url(${CardFront})`, backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}>
            <div className='flex flex-col flex-start'>
              <div><img src={CardLogo} /></div>
              <div className='mt-10 w-[300px] text-white text-xl font-bold tracking-[3px] mr-5'>{form?.cardNumber ? form?.cardNumber : "0000 0000 0000 00000"}</div>
              <div className='flex justify-between mt-5'>
                <div className='text-xs tracking-[1px] text-white'>{form?.cardName ? upperCaseTransform(form?.cardName) : "JANE APPLESEED"}</div>
                <div className='text-xs tracking-[1px] text-white'>{form?.expMonth ? form?.expMonth : "00"}/{form?.expYear ? form?.expYear : "00"}</div>
              </div>
            </div>
          </div>
          <div className='relative rounded-xl py-28 mt-10 mr-[-50px]' style={{ backgroundImage: `url(${CardBack})`, backgroundSize: "100% 100%" }}>
            <div className='fixed absolute top-[100px] right-[40px]'>{form?.cvc ? form?.cvc : "000"}</div>
          </div>
        </div>
        {/* Mobile */}
        <div className='md:hidden sm:scale-[0.8] scale-[0.7]'>
          <div className='relative rounded-xl py-28 mr-[-50px]' style={{ backgroundImage: `url(${CardBack})`, backgroundSize: "100% 100%", zIndex: -1 }}>
            <div className='fixed absolute top-[100px] right-[40px]'>{form?.cvc ? form?.cvc : "000"}</div>
          </div>
          <div className='flex rounded-xl p-8 ml-[-50px] mt-[-100px]' style={{ backgroundImage: `url(${CardFront})`, backgroundRepeat: "no-repeat", backgroundSize: "100% 100%", zIndex: 2 }}>
            <div className='flex flex-col flex-start'>
              <div><img src={CardLogo} /></div>
              <div className='mt-10 w-[300px] text-white text-xl font-bold tracking-[3px] mr-5'>{form?.cardNumber ? form?.cardNumber : "0000 0000 0000 00000"}</div>
              <div className='flex justify-between mt-5'>
                <div className='text-xs tracking-[1px] text-white'>{form?.cardName ? upperCaseTransform(form?.cardName) : "JANE APPLESEED"}</div>
                <div className='text-xs tracking-[1px] text-white'>{form?.expMonth ? form?.expMonth : "00"}/{form?.expYear ? form?.expYear : "00"}</div>
              </div>
            </div>
          </div>
        </div>
        {!submitStatus && (<div className='flex flex-col p-5'>
          <div className='mt-2'>
            <div className='text-xs font-bold tracking-[1px]'>CARDHOLDER NAME</div>
            <div className='mt-2' ><input id="cardName" className={`border-2 rounded-lg py-2 px-4 text-sm w-full ${validate?.cardName?.status ? "border-red-400" : ""}`} placeholder="e.g. Jane Appleseed" onChange={handleFormChange} value={form?.cardName} /></div>
            <div className='text-xs font-bold text-red-400 mt-2'> &nbsp; {validate?.cardName?.status ? validate?.cardName?.text : ""} </div>
          </div>
          <div className='mt-4'>
            <div className='text-xs font-bold tracking-[1px]'>CARD NUMBER</div>
            <div className='mt-2'><input id="cardNumber" className={`border-2 rounded-lg py-2 px-4 text-sm w-full ${validate?.cardNumber?.status ? "border-red-400" : ""}`} placeholder="e.g. 1234 5678 9123 0000" value={form?.cardNumber} onChange={handleFormChange} /></div>
            <div className='text-xs font-bold text-red-400 mt-2'> &nbsp; {validate?.cardNumber?.status ? validate?.cardNumber?.text : ""} </div>
          </div>
          <div className='flex flex-row mt-6'>
            <div className='flex flex-col'>
              <div className='text-xs font-bold tracking-[1px]'>EXP. DATE (MM/YY)</div>
              <div className='flex flex-row mt-2' >
                <div>
                  <input type="text" pattern="[0-9]*" inputMode='numeric' id="expMonth" className={`border-2 rounded-lg py-2 px-4 text-sm w-20 ${validate?.expMonth?.status ? "border-red-400" : ""}`} placeholder="MM" onChange={handleFormChange} value={form?.expMonth} />
                  <div className='text-xs font-bold text-red-400 mt-2'> &nbsp; {validate?.expMonth?.status ? validate?.expMonth?.text : ""} </div>
                </div>
                <div>
                  <input type="text" pattern="[0-9]*" inputMode='numeric' id="expYear" className={`ml-2 border-2 rounded-lg py-2 px-4 text-sm w-20 ${validate?.expYear?.status ? "border-red-400" : ""}`} placeholder="YY" onChange={handleFormChange} value={form?.expYear} />
                  <div className='text-xs font-bold text-red-400 mt-2'> &nbsp; {validate?.expYear?.status ? validate?.expYear?.text : ""} </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col ml-5'>
              <div className='text-xs font-bold tracking-[1px]'>CVC</div>
              <div className='flex flex-col mt-2' >
                <input type="text" pattern="[0-9]*" inputMode='numeric' id="cvc" className={`border-2 rounded-lg py-2 px-4 text-sm w-40 ${validate?.cvc?.status ? "border-red-400" : ""}`} placeholder="e.g. 123" onChange={handleFormChange} value={form?.cvc} />
                <div className='text-xs font-bold text-red-400 mt-2'> &nbsp; {validate?.cvc?.status ? validate?.cvc?.text : ""} </div>
              </div>
            </div>
          </div>
          <button className='mt-3 p-2 border-2 rounded-lg bg-slate-900 text-white' onClick={handleSubmit}>Confirm</button>
        </div>)}
        {submitStatus && (<div className='flex justify-center items-center flex-col p-5 w-[350px]'>
          <div><img src={CompleteIcon} /></div>
          <div className='mt-8 text-xl font-bold tracking-[3px]'>THANK YOU!</div>
          <div className='mt-3 text-xs font-bold'>We're added your card details</div>
          <button className='mt-5 p-2 border-2 rounded-lg bg-slate-900 text-white w-full' onClick={handleContinue}>Continue</button>
        </div>)}
      </div>
    </div>
  )
}

export default App
