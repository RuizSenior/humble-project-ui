import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRegistrationSubject = new Subject<any>();
  private userLoginSubject = new Subject<any>();
  private emailSubject = new BehaviorSubject<any>(null);
  private codeSubject = new Subject<string | null>();
  private passwordSubject = new Subject<string | null>();
  private editInfoSubject = new Subject<any>();
  private editPasswordSubject = new Subject<any>();
  private currentUserSubject = new Subject<any>();
  private enviarMensajeSubject = new Subject<any>();
  
  userRegistration$ = this.userRegistrationSubject.asObservable();
  userLogin$ = this.userLoginSubject.asObservable();
  email$ = this.emailSubject.asObservable();
  code$ = this.codeSubject.asObservable();
  password$ = this.passwordSubject.asObservable();
  editInfo$ = this.editInfoSubject.asObservable();
  editPassword$ = this.editPasswordSubject.asObservable();
  currentUser$ = this.currentUserSubject = new Subject<any>();
  enviarMensaje$ = this.enviarMensajeSubject.asObservable();
  
  
  constructor(private http: HttpClient) { }  
  // EndPoint Access
  register(data: User): Observable<any> {
    return this.http.post(`/api/user/signup`, data).pipe(
      tap(response => this.userRegistrationSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.userRegistrationSubject))
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`/api/user/login`, data).pipe(
      tap(response => this.userLoginSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.userLoginSubject))
    );
  }

  setData(data: any) {
    this.emailSubject.next(data)
  }

  clearData(){
    this.emailSubject = new BehaviorSubject<any>(null);
  }

  getData() {
    return this.emailSubject.asObservable();
  }

  sendRecoveryEmail(email: string): Observable<any> {
    return this.http.post(`/api/user/passwordrecover`, email ).pipe(
      tap(response => this.emailSubject.next(email)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.emailSubject))
    );
  }

  verifyRecoveryCode(code: string): Observable<any> {
    return this.http.post(`/api/user/codeverification`, code).pipe(
      tap(response => this.codeSubject.next(code)),
      catchError(error => this.handleError(error, this.codeSubject))
    );
  }

  resetPassword(newPassword: string): Observable<any> {
    return this.http.post(`/api/user/newpassword`, newPassword).pipe(
      tap(response => this.passwordSubject.next(newPassword)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.passwordSubject))
    );
  }

  getCurrentUser(fields: string[]): Observable<any> {
    return this.http.post(`/api/user/getuserdata`, fields).pipe(
      tap(response => this.currentUserSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.currentUserSubject))
    );
  }
  
  editPersonalInfo(data: User): Observable<any> {
    return this.http.post(`/api/user/editaccount`, data).pipe(
      tap(response => this.editInfoSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.editInfoSubject))
    );
  }

  obtenerSaldo(id: string): Observable<any> {
    return this.http.get(`/api/user/saldo/${id}`)
      .pipe(
        catchError((error: any) => {
          console.error('No se pudo obtener el saldo', error);
          const message = `No se pudo obtener el saldo: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  obtenerFacturas(id: string): Observable<any> {
    return this.http.get(`/api/user/facturas/${id}`)
      .pipe(
        catchError((error: any) => {
          console.error('No se pudieron obtener las facturas', error);
          const message = `No se pudieron obtener las facturas: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  realizarCompras(userId: string, enviarORecoger: string, booksForShop: [string,string][] ): Observable<any> {
    const body = { userId, enviarORecoger, booksForShop };
    return this.http.post(`/api/user/realizar-compra`, body)
      .pipe(
        catchError((error: any) => {
          console.error('No se pudo realizar la compra', error);
          const message = `No se pudo realizar la compra: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  generarCodigoDevoluciones(userId: string, selectedISSNs: string[] ): Observable<any> {
    const body = { userId, selectedISSNs };
    return this.http.post(`/api/user/generarCodigoDevoluciones`, body)
      .pipe(
        catchError((error: any) => {
          console.error('No se pudo realizar la devolucion', error);
          const message = `No se pudo realizar la devolucion: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  obtenerInformacionDevolucion(code: string | null): Observable<any> {
    return this.http.get(`/api/user/devolucion/${code}`)
      .pipe(
        catchError((error: any) => {
          console.error('No se pudieron obtener las devoluciones', error);
          const message = `No se pudieron obtener las devoluciones: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  generarDevoluciones(code: string | null, selectedShop: string | null ): Observable<any> {
    const body = code+","+ selectedShop;
    return this.http.post(`/api/user/generarDevoluciones/${body}`, null)
      .pipe(
        catchError((error: any) => {
          console.error('No se pudo realizar la devolucion', error);
          const message = `No se pudo realizar la devolucion: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  getMessages(userId: any): Observable<any> {
    return this.http.get(`/api/ticket/obtenerUserTickets/${userId}`)
      .pipe(
        catchError((error: any) => {
          console.error('No se pudieron obtener los mensajes', error);
          const message = `No se pudieron obtener los mensajes: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  enviarMensaje(userId: any, message: string): Observable<any> {
    const data = {
      id_usuario: userId,
      asunto: message
    };
    return this.http.post(`/api/ticket/create`, data).pipe(
      tap(response => this.enviarMensajeSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.enviarMensajeSubject))
    );
  }

  responderMensaje(selectChat: number, userId: any, message: string): Observable<any> {
    const data = {
      id_ticket: selectChat,
      id_usuario: userId,
      mensaje: message
    };
    return this.http.post(`/api/ticket/respond`, data).pipe(
      tap(response => this.enviarMensajeSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.enviarMensajeSubject))
    );
  }

  borrarMensaje(ticket: number): Observable<any> {
    return this.http.post(`/api/ticket/delete/${ticket}`, null)
      .pipe(
        catchError((error: any) => {
          console.error('No se pudieron obtener los mensajes', error);
          const message = `No se pudieron obtener los mensajes: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  private handleError(error: any, subject: Subject<any>): Observable<never> {
    subject.error(error);
    subject.next(null);

    return throwError(() => new Error(`${error.error.detail}`));
  }
}