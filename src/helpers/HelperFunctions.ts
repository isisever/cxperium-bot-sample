export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Dünya'nın yarıçapı (kilometre cinsinden)
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distance = R * c; // Kilometre cinsinden mesafe
    return distance;
}

function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export function getLatestComment(comments: any[]): any {
    if (comments.length === 0) {
        return null;
    }

    comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return comments[0];
}

export function convertTicketStatus(status: string): string {
    switch (status) {
        case 'OPEN':
            return 'Açık';
        case 'PENDING':
            return 'Beklemede';
        case 'CLOSED':
            return 'Kapalı';
        case 'NEW':
            return 'Yeni';
        default:
            return status;
    }
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arası olduğu için +1 ekliyoruz
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export const FAQ_STORES = {
    FAQ_STORES_1: {
        question: 'Mağazalarınızın çalışma saatleri nedir?',
        answer: 'Mağazalarımızın çalışma saatleri bölgelere göre değişkenlik göstermektedir. Mağazalarımızın çalışma saatlerine https://www.spx.com.tr/address/stores/ adresinden ulaşabilirsiniz.'
    },
    FAQ_STORES_2: {
        question: 'Mağazalarınızın adres bilgilerine nasıl ulaşabilirim?',
        answer: 'Mağazalarımızın adres bilgilerine https://www.spx.com.tr/address/stores/ adresinden ulaşabilirsiniz veya ana menüden size en yakın mağazamızı bulmamız için konum verinizi paylaşarak öğrenebilirsiniz.'
    }
};

export const FAQ_ONLINE = {
    FAQ_ONLINE_1: {
        question: 'Online alışverişte bedenimi nasıl bulabilirim?',
        answer: 'Online alışveriş esnasında ürün sayfasında bulunan beden rehberi bölümünden size en uygun bedeni bulabilirsiniz.'
    },
    FAQ_ONLINE_2: {
        question: 'Kargo süreci hakkında bilgi almak istiyorum.',
        answer: 'Alışverişlerinizi kargo süreci ile ilgili https://www.spx.com.tr/kargo-iade sayfamızı ziyaret edebilirsiniz?'
    }
};

