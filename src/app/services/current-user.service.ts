/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '@gravitee/ng-portal-webclient';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly currentUserSource: BehaviorSubject<User>;

  constructor(private http: HttpClient, private configurationService: ConfigurationService) {
    this.currentUserSource = new BehaviorSubject<User>(null);
  }

  revokeUser() {
    this.currentUserSource.next(null);
  }

  get(): BehaviorSubject<User> {
    return this.currentUserSource;
  }

  load() {
    const baseUrl = this.configurationService.get('baseUrl');
    return new Promise((resolve) => {
      this.http.get(baseUrl + '/user').toPromise()
        .then((data) => {
          this.currentUserSource.next(data);
        })
        .catch(() => this.currentUserSource.next(null))
        .finally(() => resolve(true));
    });
  }

}