
const nodemailer = require('nodemailer')
 const {ServerConfig} = require('../../config')

const mailSender = async (email,title,body)=>{

    try{

        let transporter = nodemailer.createTransport({
            host : ServerConfig.MAIL_HOST,
            auth : {
                user : ServerConfig.MAIL_USER,
                pass : ServerConfig.MAIL_PASS
            }
        })

        let info = await transporter.sendMail({
            from : 'TechShiksha || mail from Avinash',
            to : `${email}`,
            subject : `${title}`,
            html : `${body}`
        })

        console.log(info)
        return info;
    }
    catch(error){
        console.log('error occured in mailsender function ',error.message)
    }
}

module.exports = mailSender

